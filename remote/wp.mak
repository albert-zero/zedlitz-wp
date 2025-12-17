#
# Makefile
# Author: Albert Zedlitz
# Description:
# Generate the workpress project and manage updates
#
wp_root      = $(WP_ROOT)
path_remote  = $(wp_root)/remote
path_locales = $(wp_root)/locales
path_dist    = $(wp_root)/updates


version_old = '1.2.5'
version_new = '1.2.6'

# Generate a json file, zip the project and send it to the update server
all:  json dist

# Check settings
help:
	@echo "$(wp_root)      \t\t Project Root"
	@echo "$(path_remote)  \t\t Project Definition PHP and Makefile"
	@echo "$(path_locales) \t\t Root for Translation Texts" 
	@echo "$(path_dist) \t\t Shared Directory for Distribution"
	@echo "===== Targets ====="
	@echo "json    \t Create the Translation module"
	@echo "version \t Sets the version consistently to all components"
	@echo "dist    \t Create the distribution"
	@echo "patch   \t Sends a modified translation module direct to WordPress"
	@echo "patch_all \t patches all changes direct to WordPress"
	@echo "mount_update \t Mount update directory to remote distribution"

# Generate json file
json: $(path_locales)/content.json

touch:
	touch $(path_locales)/de_DE/LC_MESSAGES/content.po
	touch $(path_locales)/en_EN/LC_MESSAGES/content.po

$(path_locales)/content.json: \
	$(path_locales)/de_DE/LC_MESSAGES/content.po \
	$(path_locales)/en_EN/LC_MESSAGES/content.po
	python3 $(wp_root)/remote/cmpjsn.py -d $(wp_root)/locales

# Set a consistent version info to all files in project
version:
	sed -i 's/$(version_old)/$(version_new)/' $(path_remote)/update.php
	sed -i 's/$(version_old)/$(version_new)/' $(wp_root)/zedlitz-wp.php
	sed -i 's/$(version_old)/$(version_new)/' $(wp_root)/update.php
	sed -i 's/$(version_old)/$(version_new)/' $(path_locales)/de_DE/LC_MESSAGES/content.po
	sed -i 's/$(version_old)/$(version_new)/' $(path_locales)/en_EN/LC_MESSAGES/content.po

# Send the wordpress project
dist:
	rm $(path_dist)/*
	(find $(wp_root)  -not -path "*/remote/*" \( -name \*.php -o -name \*.js -o -name \*.css -o -name \*.json \) | zip $(path_dist)/zedlitz-wp.zip -@)
	cp  $(path_remote)/update.php $(path_dist)
	scp $(path_dist)/* u75606034@home506332748.1and1-data.host:update

# Patch translation files
patch_all:
	scp $(path_locales)/content.json     u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/locales	
	scp $(wp_root)/js/zedlitz-popup.js   u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/js

patch:
	scp $(path_locales)/content.json  u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/locales	

mount_update:
	sshfs u75606034@home506332748.1and1-data.host:update $(path_dist)

