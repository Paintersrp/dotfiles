case $- in
*i*) ;;
*) return ;;
esac

export OSH="/home/srp/.oh-my-bash"

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

##############################################################################
##############################################################################
##                                                                          ##
##   ██╗   ██╗ █████╗ ██████╗ ██╗ █████╗ ██████╗ ██╗     ███████╗███████╗   ##
##   ██║   ██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝   ##
##   ██║   ██║███████║██████╔╝██║███████║██████╔╝██║     █████╗  ███████╗   ##
##   ╚██╗ ██╔╝██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ╚════██║   ##
##    ╚████╔╝ ██║  ██║██║  ██║██║██║  ██║██████╔╝███████╗███████╗███████║   ##
##     ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝   ##
##                                                                          ##                                                                                ##
##############################################################################
##############################################################################

export GOPATH="$HOME/go"
PATH="${PATH:+${PATH}:}"$SCRIPTS":"$HOME"/.local/bin:$HOME/dotnet"
export PATH="$PATH:/home/srp/.local/bin:$GOPATH/bin"

export DOTFILES="$HOME/dotfiles"
export SCRIPTS="$DOTFILES/.scripts"
export CODE="$HOME/Code"
export NOTES="$HOME/test-rclone/"
export REPOS="$CODE/repos"
export GITUSER="Paintersrp"

#############################################################
#############################################################
##                                                         ##
##                                                         ##
##    █████╗ ██╗     ██╗ █████╗ ███████╗███████╗███████╗   ##
##   ██╔══██╗██║     ██║██╔══██╗██╔════╝██╔════╝██╔════╝   ##
##   ███████║██║     ██║███████║███████╗█████╗  ███████╗   ##
##   ██╔══██║██║     ██║██╔══██║╚════██║██╔══╝  ╚════██║   ##
##   ██║  ██║███████╗██║██║  ██║███████║███████╗███████║   ##
##   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ##
##                                                         ##
##                                                         ##
#############################################################
#############################################################
alias install="sudo pacman -S"
alias pkg_view="pacman -Ss"
alias dot="cd $DOTFILES"
alias urlencode="$SCRIPTS/urlencode.sh"
alias goog="$SCRIPTS/google.sh"
alias cdgo="cd $CODE/go"
alias cdastro="cd $CODE/astro"
alias cdnext="cd $CODE/nextjs"
alias cdreact="cd $CODE/react"
alias syu='sudo pacman -Syu'
alias t='tmux'
alias e='exit'
# alias an="~/Code/go/an-dev/an-cli"

# fzf with preview
alias fp="fzf --preview 'bat --style=numbers --color=always --line-range :500 {}'"

# fzf to vim
alias vf='nvim $(fp)'

####################################################################################
####################################################################################
##                                                                                ##
##   ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗   ##
##   ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝   ##
##   █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗   ##
##   ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║   ##
##   ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║   ##
##   ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ##
##                                                                                ##
####################################################################################
####################################################################################

# This function is stolen from rwxrob
clone() {
	local repo="$1" user
	local repo="${repo#https://github.com/}"
	local repo="${repo#git@github.com:}"

	if [[ $repo =~ / ]]; then
		user="${repo%%/*}"
	else
		user="$GITUSER"
		[[ -z "$user" ]] && user="$USER"
	fi

	local name="${repo##*/}"
	local userd="$REPOS/$user"
	local path="$userd/$name"

	[[ -d "$path" ]] && cd "$path" && return

	mkdir -p "$userd"
	cd "$userd"

	echo gh repo clone "$user/$name" -- --recurse-submodule
	gh repo clone "$user/$name" -- --recurse-submodule

	cd "$name"

} && export -f clone

auth() {
	if [ -z "$SSH_AUTH_SOCK" ]; then
		eval $(ssh-agent -s)
	fi

	ssh-add -q ~/.ssh/id_ed25519
}
