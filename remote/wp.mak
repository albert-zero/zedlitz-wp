#
# Makefile
# Generate the distribution:
#

all:  json dist
	
json: ~/Projects/zedlitz-wp/locales/content.json

~/Projects/zedlitz-wp/locales/content.json: \
	~/Projects/zedlitz-wp/locales/de_DE/LC_MESSAGES/content.po \
	~/Projects/zedlitz-wp/locales/en_EN/LC_MESSAGES/content.po
	python3 cmpjsn.py 

dist:
	(cd ~/Projects/ && find zedlitz-wp  -not -path "*/remote/*" \( -name \*.php -o -name \*.js -o -name \*.css -o -name \*.json \) | zip ~/Projects/remote/zedlitz-wp.zip -@)
	cp  ~/Projects/zedlitz-wp/remote/update.php ~/Projects/remote
	scp ~/Projects/remote/* u75606034@home506332748.1and1-data.host:update

patch:
	scp ~/Projects/zedlitz-wp/locales/content.json  u75606034@home506332748.1and1-data.host:clickandbuilds/ZedlitzArt/wp-content/plugins/zedlitz-wp/locales

