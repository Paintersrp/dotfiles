# Enable the subsequent settings only in interactive sessions
case $- in
*i*) ;;
*) return ;;
esac

# Path to your oh-my-bash installation.
export OSH='/home/srp/.oh-my-bash'

OMB_USE_SUDO=true

completions=(
	git
	composer
	ssh
)

aliases=(
	general
)

plugins=(
	git
	bashmarks
)

source "$OSH"/oh-my-bash.sh
eval "$(starship init bash)"

logo=$(
	cat <<"EOF"
███████╗   ██████╗    ██████╗ 
██╔════╝   ██╔══██╗   ██╔══██╗
███████╗   ██████╔╝   ██████╔╝
╚════██║   ██╔══██╗   ██╔═══╝ 
███████║██╗██║  ██║██╗██║     
╚══════╝╚═╝╚═╝  ╚═╝╚═╝╚═╝    
EOF
)

# Function to center text
center_text() {
	local text="$1"
	local width=$(tput cols)
	local padding=$((($width - ${#text}) / 2))
	printf "%${padding}s%s\n" "" "$text"
}

# Add newlines for spacing
logo="\n$logo\n"

# Center the entire logo
centered_logo=$(echo -e "$logo" | while IFS= read -r line; do center_text "$line"; done)

# Display the centered logo
echo -e "$centered_logo"
