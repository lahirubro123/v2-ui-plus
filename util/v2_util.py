import atexit
import json
import logging
import os
import platform
import re
import subprocess
import sys
import time
from collections import deque
from enum import Enum
from threading import Timer, Lock
from typing import Optional, List

import psutil

from util import config, list_util, cmd_util, file_util, json_util
from v2ray.models import Inbound

V2_CONF_KEYS = [
    "log",
    "api",
    "dns",
    "routing",
    "policy",
    "inbounds",
    "outbounds",
    "transport",
    "stats",
    "reverse",
]

__is_windows: bool = platform.system() == "Windows"
__v2ray_file_name: str = "v2ray.exe" if __is_windows else "v2ray"
__v2ctl_file_name: str = "v2ctl.exe" if __is_windows else "v2ctl"

__v2ray_cmd: str = (
    config.get_v2ray_cmd_path()
    if config.get_v2ray_cmd_path() != ""
    else os.path.join(config.BASE_DIR, "bin", __v2ray_file_name)
)
__v2ctl_cmd: str = (
    config.get_v2ctl_cmd_path()
    if config.get_v2ctl_cmd_path() != ""
    else os.path.join(config.BASE_DIR, "bin", __v2ctl_file_name)
)
__v2ray_conf_path: str = (
    config.get_v2_config_path()
    if config.get_v2_config_path() != ""
    else os.path.join(config.BASE_DIR, "bin", "config.json")
)

__v2ray_process: Optional[subprocess.Popen] = None
__v2ray_error_msg: str = ""
__v2ray_version: str = ""
__v2ray_process_lock: Lock = Lock()

__traffic_pattern_inbound = re.compile(
    'stat:\s*<\s*name:\s*"inbound>>>(?P<tag>[^>]+)>>>traffic>>>(?P<type>uplink|downlink)"(\s*value:\s*(?P<value>\d+))?'
)
__traffic_pattern_user = re.compile(
    'stat:\s*<\s*name:\s*"user>>>(?P<user>[^>]+)>>>traffic>>>(?P<type>uplink|downlink)"(\s*value:\s*(?P<value>\d+))?'
)


class Protocols(Enum):
    VMESS = "vmess"
    VLESS = "vless"
    TROJAN = "trojan"
    SHADOWSOCKS = "shadowsocks"
    DOKODEMO = "dokodemo-door"
    SOCKS = "socks"
    HTTP = "http"


def start_v2ray():
    global __v2ray_process, __v2ray_error_msg
    encoding = "gbk" if __is_windows else "utf-8"
    __v2ray_process = subprocess.Popen(
        [__v2ray_cmd, "-config", __v2ray_conf_path],
        shell=False,
        stderr=subprocess.STDOUT,
        stdout=subprocess.PIPE,
        encoding=encoding,
    )
    logging.info("start v2ray")

    def f():
        global __v2ray_error_msg
        p = __v2ray_process
        last_lines: deque = deque()
        try:
            while p.poll() is None:
                line = p.stdout.readline()
                if not line:
                    break
                if len(last_lines) >= 10:
                    last_lines.popleft()
                last_lines.append(line)
        except Exception as ex:
            logging.warning(ex)
        finally:
            __v2ray_error_msg = "\n".join(last_lines)

    __v2ray_error_msg = ""
    Timer(0, f).start()


def stop_v2ray():
    global __v2ray_process
    if __is_windows:
        for p in psutil.process_iter():
            if "v2ray" in p.name():
                p.terminate()
    if __v2ray_process is not None:
        try:
            __v2ray_process.terminate()
            logging.info("stop v2ray")
        except Exception as e:
            logging.warning(f"stop v2ray error: {e}")
        finally:
            __v2ray_process = None


def restart_v2ray():
    with __v2ray_process_lock:
        stop_v2ray()
        start_v2ray()


def gen_v2_config_from_db():
    inbounds = Inbound.query.filter_by(enable=True).all()
    inbounds = [inbound.to_v2_json() for inbound in inbounds]
    # merge inbounds shared with the same port and protocol
    # inbounds_merged = []
    # if len(inbounds) > 1:
    #     for inbound in inbounds:
    #         if len(inbounds_merged) == 0:
    #             inbounds_merged.append(inbound)
    #         else:
    #             if (inbounds_merged[-1]['port'] == inbound['port']):
    #                 inbounds_merged[-1]['settings']['clients'] += inbound['settings']['clients']
    #             else:
    #                 inbounds_merged.append(inbound)
    v2_config = json.loads(config.get_v2_template_config())
    v2_config["inbounds"] += inbounds
    for conf_key in V2_CONF_KEYS:
        if conf_key not in v2_config:
            v2_config[conf_key] = {}
    return v2_config


def read_v2_config() -> Optional[dict]:
    try:
        content = file_util.read_file(__v2ray_conf_path)
        return json.loads(content)
    except Exception as e:
        logging.error(
            "An error occurred while reading the v2ray configuration file: " + str(e)
        )
        return None


def write_v2_config(v2_config: dict):
    if read_v2_config() == v2_config:
        return
    try:
        file_util.write_file(__v2ray_conf_path, json_util.dumps(v2_config))
        restart(True)
    except Exception as e:
        logging.error(
            "An error occurred while writing the v2ray configuration file: " + str(e)
        )


def __get_api_address_port():
    template_config = json.loads(config.get_v2_template_config())
    inbounds = template_config["inbounds"]
    api_inbound = list_util.get(inbounds, "tag", "api")
    return api_inbound["listen"], api_inbound["port"]


def __get_stat_code():
    if __v2ray_process is None or __v2ray_process.poll() is not None:
        if __v2ray_error_msg != "":
            return 2
        return 1
    return 0


def get_v2ray_version():
    global __v2ray_version
    if __v2ray_version != "":
        return __v2ray_version
    result, code = cmd_util.exec_cmd(f"{__v2ray_cmd} -version")
    if code != 0:
        return "Unknown"
    else:
        try:
            __v2ray_version = result.split(" ")[1]
            return __v2ray_version
        except Exception as e:
            logging.warning(f"get v2ray version failed: {e}")
            return "Error"


def get_v2ray_error_msg():
    return __v2ray_error_msg


def is_running():
    return __get_stat_code() == 0


def restart(now=False):
    def f():
        try:
            restart_v2ray()
        except Exception as e:
            logging.warning(f"restart v2ray error: {e}")

    if now:
        f()
    else:
        Timer(3, f).start()


try:
    __api_address, __api_port = __get_api_address_port()
    if not __api_address or __api_address == "0.0.0.0":
        __api_address = "127.0.0.1"
except Exception as e:
    logging.error("Failed to open v2ray api, please reset all panel settings.")
    logging.error(str(e))
    sys.exit(-1)


def __get_v2ray_api_cmd(address, service, method, pattern, reset):
    cmd = "%s api --server=%s:%d %s.%s 'pattern: \"%s\" reset: %s'" % (
        __v2ctl_cmd,
        address,
        __api_port,
        service,
        method,
        pattern,
        reset,
    )
    return cmd


def get_inbounds_traffic(reset=True):
    if __api_port < 0:
        logging.warning("v2ray api port is not configured.")
        return None
    cmd = __get_v2ray_api_cmd(
        "127.0.0.1", "StatsService", "QueryStats", "", "true" if reset else "false"
    )
    result, code = cmd_util.exec_cmd(cmd)
    if code != 0:
        logging.warning("v2ray api code %d" % code)
        return None
    inbounds = []
    for match in __traffic_pattern_inbound.finditer(result):
        tag = match.group("tag")
        # tag = codecs.getdecoder('unicode_escape')(tag)[0]
        # tag = tag.encode('ISO8859-1').decode('utf-8')
        if tag == "api":
            continue
        traffic_type = match.group("type")
        value = match.group("value")
        if not value:
            value = 0
        else:
            value = int(value)
        inbound = list_util.get(inbounds, "tag", tag)
        if inbound:
            inbound[traffic_type] = value
        else:
            inbounds.append({"tag": tag, traffic_type: value})
    return inbounds


def init_v2ray():
    file_util.write_file(__v2ray_conf_path, "{}")
    v2_config = gen_v2_config_from_db()
    write_v2_config(v2_config)


@atexit.register
def on_exit():
    stop_v2ray()
