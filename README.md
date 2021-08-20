## Feature
Repair the existing BUG and optimize some functions;
Increase account management function
Common users and administrator users can be added, the first user is the administrator user by default and cannot be deleted;
Multiple accounts can be activated/deactivated/deleted in batches, and they can be sorted by creation/user name/traffic in ascending and descending order;
Each user can independently add multiple inbound configurations, and each inbound configuration separately counts traffic.
Now you can add the configuration of the same port, and automatically merge the configuration of the same protocol and the same port before writing the configuration file;
Modify the traffic statistics method to "email" to facilitate independent statistics on the traffic of each inbound configuration after the configuration is merged;
Add Dockerfile, you can use this project in Docker after compiling by yourself;
Add the "v2ray external port" setting item to display the external port of Haproxy or Nginx proxy to generate the correct configuration link/QR code;
Add the “v2ray external TLS” setting item to display the TLS status of Haproxy or Nginx proxy to generate the correct configuration link/QR code;
Fix the log function, now the log can be successfully output to stdout and log file;
Add "Use Xray-Core" setting item, which can replace Core with Xray-Core, and add fallback support;
Use modifiers to easily implement authentication functions;
Now "in order of creation" sorting can be used normally.


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
