copy:
	sudo cp index.html /var/www/html/index.html
	sudo cp -r resources/ /var/www/html/
	sudo systemctl restart nginx