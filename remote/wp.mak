#
# Makefile
# Generate the distribution:
#
dist:
	(cd ~/Projects/ && find zedlitz-wp  -not -path "*/remote/*" \( -name \*.php -o -name \*.js -o -name \*.css -o -name \*.json \) | zip ~/Projects/remote/zedlitz-wp.zip -@)
	cp ~/Projects/zedlitz-wp/remote/update.php ~/Projects/remote


