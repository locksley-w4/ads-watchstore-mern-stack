#!/bin/bash

# Installation
sudo dnf update -y
sudo dnf install -y docker
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose

# Apply permissions
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Create symlink for the old "docker-compose" command
sudo ln -sf /usr/local/lib/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

# Enabling docker service
sudo systemctl enable --now docker

# User config
sudo usermod -aG docker ec2-user