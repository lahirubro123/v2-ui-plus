<h1 align="center">Welcome to v2ray-ui++ 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.5.1-blue.svg?cacheSeconds=2592000" />
</p>

> This is an enhanced version of the original author's version of v2-ui , which adds functions such as account management, single port and multiple users, and more functions are still in the secondary development

## Featurers

<ul style="list-style-type:circle">
  
<li>Repair the existing BUG and optimize some functions; </li>
<li>Increase account management function </li>
<li>Common users and administrator users can be added, the first user is the administrator user by default and cannot be deleted; </li>
<li>Multiple accounts can be activated/deactivated/deleted in batches, and they can be sorted by creation/user name/traffic in ascending and descending order; </li>
<li>Each user can independently add multiple inbound configurations, and each inbound configuration separately counts traffic.</li>
<li>Now you can add the configuration of the same port, and automatically merge the configuration of the same protocol and the same port before writing the configuration file; </li>
<li>Modify the traffic statistics method to "email" to facilitate independent statistics on the traffic of each inbound configuration after the configuration is merged;</li>
<li>Add Dockerfile, you can use this project in Docker after compiling by yourself; </li>
<li>Add the "v2ray external port" setting item to display the external port of Haproxy or Nginx proxy to generate the correct configuration link/QR code; </li>
<li>Add the “v2ray external TLS” setting item to display the TLS status of Haproxy or Nginx proxy to generate the correct configuration link/QR code; </li>
<li>Fix the log function, now the log can be successfully output to stdout and log file; </li>
<li>Add "Use Xray-Core" setting item, which can replace Core with Xray-Core, and add fallback support; </li>
<li>Use modifiers to easily implement authentication functions; </li>
<li>Now "in order of creation" sorting can be used normally. </li>
  </ul>


## How To Use

Update System 
```
sudo apt-get update
```
```
sudo apt-get upgrade
```
```
sudo apt install curl
```

clone project 
```
git clone https://github.com/lahirubro123/v2-ui-plus.git
```

run project 
```
python3 v2-ui.py
```

obtain cerificate 
```
sudo apt install software-properties-common
```
```
sudo add-apt-repository ppa:certbot/certbot
```
```
sudo apt-get install certbot
```
```
sudo certbot certonly --standalone --preferred-challenges http --agree-tos --email your-email-address -d test.example.com 
```

auto renew certificate
```
crontab -e
```
```
0 12 * * * /usr/bin/certbot renew --quiet
```

Auto Installer
```
wget -q https://raw.githubusercontent.com/lahirubro123/v2-ui-plus/master/autoinstall.sh && bash autoinstall.sh
```

## Author

* Github: [@lahirubro123](https://github.com/lahirubro123)

## Show your support

Give a ⭐️ if this project helped you!

***


