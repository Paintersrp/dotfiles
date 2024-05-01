#!/bin/bash

name=$1

if [ $# -eq 0 ]; then
	# ask for name of script
	echo "Please provide a name for the script"
	read -r name
fi

cd "$SCRIPTS" || exit
touch "$name"
chmod +x "$name"
echo "#!/bin/bash" >"$name"
