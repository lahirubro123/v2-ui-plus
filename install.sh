#!/bin/sh


 
# Get the latest package lists
apt-get update
apt-get upgrade
apt install python3-pip
 
# Git Clone
git clone https://github.com/lahirubro123/v2-ui-plus.git
mv v2-ui-plus /usr/local/sbin/v2-ui-plus

# Install from Repo
cd /usr/local/sbin/v2-ui-plus
pip3 install -r requirements.txt

# Install snap packages
tmux 
cd /usr/local/sbin/v2-ui-plus
sudo apt install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install certbot


 
# install certificate
echo Hello, what is your e mail address ?
read email
echo what is your doamin ?
read domain
sudo certbot certonly --standalone --preferred-challenges http --agree-tos --email $email -d $domain 


