#!/bin/sh


 
# Get the latest package lists
echo script from Bunny_LK
apt-get update
apt-get upgrade
apt install python3-pip
 
# Git Clone
git clone https://github.com/lahirubro123/v2-ui-plus.git
mv v2-ui-plus /usr/local/sbin/v2-ui-plus

# Install from Repo
cd /usr/local/sbin/v2-ui-plus
pip3 install -r requirements.txt




# open tmux session
cd /usr/local/sbin/v2-ui-plus
tmux new-session -d -s v2ray python3 v2-ui.py
echo please wait adding cronjob
(crontab -l; echo "30 0 * * * 0 12 * * * /usr/bin/certbot renew --quiet") | sort -u | crontab -
echo panel  your_ip:65432
echo Thank You.....!! (Bunny_lk)
read -r -s -p $'Press enter to continue...'

# Install  packages
sudo apt install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install certbot

# install certificate
echo Hello, what is your e mail address ?
read email
echo what is your doamin ?
read domain
sudo certbot certonly --standalone --preferred-challenges http --agree-tos --email $email -d $domain 





