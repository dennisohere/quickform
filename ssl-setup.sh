#!/bin/bash

# SSL Setup Script for QuickForm
# This script handles SSL certificate setup using Let's Encrypt

set -e

# Get environment variables
SSL_DOMAIN=${SSL_DOMAIN:-"quickform.sandbox.prolificlabs.dev"}
SSL_EMAIL=${SSL_EMAIL:-"admin@prolificlabs.dev"}
SSL_SUBDOMAINS=${SSL_SUBDOMAINS:-""}

echo "SSL Setup starting for domain: $SSL_DOMAIN"

# Function to check if certificate exists
cert_exists() {
    local domain=$1
    [ -d "/etc/letsencrypt/live/$domain" ] && [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]
}

# Function to check if certificate is valid
cert_is_valid() {
    local domain=$1
    if cert_exists "$domain"; then
        # Check if certificate expires in more than 30 days
        local expiry_date=$(openssl x509 -in "/etc/letsencrypt/live/$domain/fullchain.pem" -noout -enddate | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        [ $days_until_expiry -gt 30 ]
    else
        false
    fi
}

# Main SSL setup logic
if [ "$1" = "certbot" ]; then
    # Running in certbot container
    echo "Running in certbot container..."
    
    # Wait for nginx to be ready
    echo "Waiting for nginx to be ready..."
    sleep 10
    
    # Check if we need to obtain or renew certificates
    if ! cert_exists "$SSL_DOMAIN" || ! cert_is_valid "$SSL_DOMAIN"; then
        echo "Certificate for $SSL_DOMAIN needs to be obtained or renewed"
        
        # Build certbot command
        cmd="certbot certonly --webroot --webroot-path=/var/www/public"
        cmd="$cmd --email $SSL_EMAIL --agree-tos --no-eff-email"
        cmd="$cmd --domains $SSL_DOMAIN"
        
        # Add subdomains if specified
        if [ -n "$SSL_SUBDOMAINS" ]; then
            IFS=',' read -ra SUBDOMAINS <<< "$SSL_SUBDOMAINS"
            for subdomain in "${SUBDOMAINS[@]}"; do
                cmd="$cmd --domains $subdomain.$SSL_DOMAIN"
            done
        fi
        
        echo "Running: $cmd"
        eval $cmd
        
        echo "Certificate obtained successfully"
    else
        echo "Certificate for $SSL_DOMAIN is valid and up to date"
    fi
    
    # Set up automatic renewal
    echo "Setting up automatic renewal..."
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
elif [ "$1" = "nginx" ]; then
    # Running in nginx container
    echo "Running in nginx container..."
    
    # Wait for certificates to be available
    echo "Waiting for SSL certificates..."
    while ! cert_exists "$SSL_DOMAIN"; do
        echo "Waiting for certificate for $SSL_DOMAIN..."
        sleep 30
    done
    
    echo "SSL certificates are ready"
    
else
    # Default behavior - just echo info
    echo "SSL Setup Script"
    echo "Domain: $SSL_DOMAIN"
    echo "Email: $SSL_EMAIL"
    echo "Subdomains: $SSL_SUBDOMAINS"
    echo ""
    echo "This script should be run from within the certbot or nginx containers."
fi

echo "SSL setup completed" 