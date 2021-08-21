#!/bin/sh


 
# Get the latest package lists
echo script from Bunny_LK
apt-get update
apt-get upgrade
apt install python3-pip
 
# Git Clone
git clone https://github.com/lahirubro123/v2-ui-plus.git
mv v2-ui-plus /etc/v2-ui-plus

# Install from Repo
cd /etc/v2-ui-plus
pip3 install -r requirements.txt

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
(crontab -l; echo "30 0 * * * 0 12 * * * /etc/certbot renew --quiet") | sort -u | crontab -

# open tmux session
cd /etc/v2-ui-plus
tmux new-session -d -s v2ray python3 v2-ui.py
echo panel  your_ip:65432
echo Thank You.....!! Bunny_lk
read -r -s -p $'Press enter to continue...'

echo thank you
