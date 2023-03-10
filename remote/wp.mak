#
# Makefile
# Author: Albert Zedlitz
# Description:
# Generate the workpress project and manage updates
#
root_path   = ~/Projects/plugin
wp_path     = $(root_path)/zedlitz-wp
dest_path   = $(root_path)/remote

version_old = '1.2.4'
version_new = '1.2.5'

# Generate a json file, zip the project and send it to the update server
all:  json dist

# Check settings
outp:
	@echo $(root_path)
	@echo $(dest_path)
	@echo $(wp_path)

# Generate json file
json: $(wp_path)/locales/content.json

touch:
	touch $(wp_path)/locales/de_DE/LC_MESSAGES/content.po
	touch $(wp_path)/locales/en_EN/LC_MESSAGES/content.po

$(wp_path)/locales/content.json: \
	$(wp_path)/locales/de_DE/LC_MESSAGES/content.po \
	$(wp_path)/locales/en_EN/LC_MESSAGES/content.po
	python3 $(wp_path)/remote/cmpjsn.py $(wp_path)/locales

# Set a consistent version info to all files in project
version:
	sed -i 's/$(version_old)/$(version_new)/' $(wp_path)/remote/update.php
	sed -i 's/$(version_old)/$(version_new)/' $(wp_path)/zedlitz-wp.php
	sed -i 's/$(version_old)/$(version_new)/' $(wp_path)/update.php
	sed -i 's/$(version_old)/$(version_new)/' $(wp_path)/locales/de_DE/LC_MESSAGES/content.po
	sed -i 's/$(version_old)/$(version_new)/' $(wp_path)/locales/en_EN/LC_MESSAGES/content.po

# Send the wordpress project
dist:
	rm $(dest_path)/*
	(cd $(root_path) && find zedlitz-wp  -not -path "*/remote/*" \( -name \*.php -o -name \*.js -o -name \*.css -o -name \*.json \) | zip $(dest_path)/zedlitz-wp.zip -@)
	cp  $(wp_path)/remote/update.php $(dest_path)
	scp $(dest_path)/* u75606034@home506332748.1and1-data.host:update

# Patch translation files
patch:
	scp $(wp_path)/locales/content.json  u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/locales
	scp $(wp_path)/js/zedlitz-popup.js   u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/js

