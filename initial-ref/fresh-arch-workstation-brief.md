# Fresh Arch Workstation Brief

Status: curated implementation handoff, not a Junction/TCS/DWG artifact.

## 1. Starting boundary

Begin from a working Arch Linux installation with graphics, networking, and a usable Hyprland session. The user owns the base Arch installation, boot setup, GPU/driver setup, storage, and low-level network setup.

This brief owns the reproducible user workstation layered on top: desktop packages, development environment, dotfile deployment, runtime managers, agent tools, shell/editor setup, diagnostics, and deliberate updates.

## 2. Package ownership

Use one clear owner per category:

- Pacman: OS-integrated desktop software, CLI utilities, build tools, Quickshell/QML/Lua tooling, system Python, Go, Bun, `mise`, `uv`, `rustup`, OpenCode, Codex.
- Paru/AUR: deliberate exceptions only, initially `visual-studio-code-bin` and `claude-code`.
- mise: Node LTS, pnpm, and project-specific runtime overrides where appropriate.
- uv: Python project interpreters/environments/dependencies.
- rustup: Rust toolchains, targets, and components.
- npm under mise-owned Node: Pi.
- NvChad/lazy.nvim: Neovim plugin layer.
- Git + GNU Stow: workstation configuration.

Do not introduce Nix, Ansible, chezmoi, a custom package abstraction, or multiple Node version managers unless a real requirement appears.

## 3. Canonical package manifests

Use package names, not pinned versions.

### packages/pacman/desktop.txt

```text
hyprland
quickshell
ghostty
hyprlock

xdg-desktop-portal
xdg-desktop-portal-hyprland
xdg-desktop-portal-gtk
hyprpolkitagent

pipewire
pipewire-audio
pipewire-alsa
pipewire-pulse
wireplumber

grim
slurp
wl-clipboard

firefox
chromium

nautilus
file-roller
gnome-keyring

inter-font
noto-fonts
noto-fonts-emoji
ttf-jetbrains-mono-nerd
```

### packages/pacman/development.txt

```text
base-devel
git
git-lfs
openssh
curl
wget
rsync
unzip
zip
7zip
stow
pacman-contrib

ripgrep
fd
jq
yq
bat
eza
git-delta

github-cli
lazygit

clang
cmake
ninja
pkgconf
gdb

shellcheck
shfmt

python
uv
mise
rustup
go
gopls
bun

lua-language-server
qt6-declarative

neovim
tree-sitter-cli
```

### packages/pacman/shell.txt

```text
zsh
zsh-completions
zsh-autosuggestions
zsh-syntax-highlighting
fzf
zoxide
direnv
```

### packages/pacman/agents.txt

```text
opencode
openai-codex
```

### packages/aur.txt

```text
visual-studio-code-bin
claude-code
```

### packages/npm-global.txt

```text
@earendil-works/pi-coding-agent
```

## 4. Terminal and shell

Terminal: Ghostty.

Shell: Zsh + restrained Oh My Zsh.

Oh My Zsh lives outside the dotfiles repository at approximately:

```text
~/.local/share/oh-my-zsh
```

Bootstrap clones it only if absent. Do not use the OMZ installer to overwrite `.zshrc`, change shell metadata, or auto-update itself.

Tracked `.zshrc` should use a very small OMZ plugin set, initially:

```text
git
gh
```

Load Arch-packaged autosuggestions and syntax highlighting directly. No shell plugin manager on top of OMZ.

Use a small custom prompt showing only useful context:

- current path/project;
- Git branch and dirty state;
- previous nonzero exit status.

Ghostty owns terminal title integration. Disable OMZ automatic title mutation.

Shell integrations:

```text
mise
fzf
zoxide
direnv
```

Keep `cd`, `z`, and `zi` distinct. Do not globally replace `cat`, `grep`, `find`, or `ls` with modern alternatives. A few explicit aliases such as `ll='eza -lah --git'` are fine.

Use shared Zsh history under XDG state, with duplicate suppression and commands prefixed by space excluded.

## 5. Runtime policy

### Node / pnpm

Pacman installs `mise`; mise owns the default developer Node runtime.

Global configuration should request approximately:

```toml
[tools]
node = "lts"
pnpm = "latest"
```

Enable Node idiomatic version files such as `.nvmrc` and `.node-version` through mise. Do not install nvm.

### Python

System Python belongs to Arch. Use `uv` for project Python versions, environments, and dependencies. Do not use global `pip install --user` as workstation policy.

### Rust

Pacman owns `rustup`; rustup owns the toolchain.

Bootstrap:

```text
rustup default stable
rustup component add rust-analyzer
```

The default rustup profile already supplies normal core developer components such as Cargo, rustfmt, and Clippy.

### Go / Bun

Use Arch packages as the workstation defaults. Add project-specific version overrides only when a project actually requires them.

## 6. Neovim / NvChad

Use Arch Neovim + NvChad v2.5-style starter configuration.

The repository owns a starter-derived `~/.config/nvim`; bootstrap must not clone NvChad over it.

Dependencies include:

- Neovim >= 0.11;
- `tree-sitter-cli`;
- ripgrep/build tools already in the package baseline;
- JetBrains Mono Nerd Font in Ghostty.

The first interactive `nvim` launch is allowed to hydrate lazy.nvim/NvChad/plugins. Bootstrap does not silently run a headless plugin sync.

Use NvChad's normal facilities rather than adding duplicate explorers, completion systems, statuslines, fuzzy finders, or plugin managers.

Project-relevant editor configuration should include:

- `lua-language-server` with Hyprland's installed `/usr/share/hypr/stubs` available to LuaLS;
- QML language tooling for Quickshell (`qmlls6` or `/usr/lib/qt6/bin/qmlls`, depending on package PATH layout);
- a Tokyo-Night-compatible NvChad/Base46 theme.

Quickshell uses Inter; Ghostty/NvChad use JetBrains Mono Nerd Font.

## 7. Developer applications and agents

Install:

- OpenCode: Pacman;
- Codex: Pacman;
- Claude Code: AUR through Paru;
- Pi: npm under mise-owned Node;
- Microsoft VS Code binary: `visual-studio-code-bin` through AUR;
- Firefox + Chromium for Gecko/Blink coverage;
- Nautilus + File Roller;
- GNOME Keyring as the Secret Service implementation.

Do not reproduce credentials in dotfiles.

Authentication remains interactive after bootstrap:

```text
Git identity
GitHub CLI / SSH
Claude
Codex
OpenCode provider credentials
Pi provider credentials
VS Code sync
```

## 8. Git policy

Track workstation defaults under XDG config, but never commit user identity, signing keys, private keys, tokens, or credentials.

Useful defaults include:

```text
core.editor = nvim
core.pager = delta
init.defaultBranch = main
fetch.prune = true
push.autoSetupRemote = true
rerere.enabled = true
interactive.diffFilter = delta --color-only
merge.conflictStyle = zdiff3
```

Do not globally force a pull rebase/merge policy for every repository.

SSH private keys remain outside the dotfiles repository.

## 9. Bootstrap contract

`./bootstrap` establishes missing workstation state. It is not a generic updater or repair daemon.

Required order:

1. Preconditions.
2. One coherent Pacman full upgrade/install.
3. Bootstrap Paru if absent.
4. Interactive AUR installation.
5. Install Oh My Zsh if absent.
6. Deploy tracked dotfiles with Stow.
7. Initialize mise and Rust.
8. Install Pi if absent.
9. Offer to set Zsh as login shell.
10. Perform static validation.
11. Run `doctor`.

### Preconditions

Require Arch, Pacman, a sane `$HOME`, the expected repository shape, a non-root user, and usable sudo. Do not run the script itself as root.

### Pacman

Combine and deduplicate all official manifests and run one operation equivalent to:

```text
sudo pacman -Syu --needed <manifest packages>
```

Never use `pacman -Sy` as a dry-run or setup shortcut.

If Pacman fails, stop.

### Paru

If absent, clone its AUR package in a temporary/cache directory and run `makepkg -si` as the normal user. `base-devel` and Git will already exist from the Pacman stage.

AUR installation remains interactive. Do not suppress PKGBUILD review with a blanket `--noconfirm` policy.

### Stow

Use `stow --restow` for tracked packages.

If a destination contains a real existing file not owned by our Stow deployment, stop and report it. Do not use `stow --adopt` automatically.

### Host profile

Do not invent monitor geometry. If the machine has no host profile, report detected outputs and require the user to create/select an explicit host profile containing monitor identity, resolution, refresh, scale, physical layout, and workspace bank.

## 10. Dry-run semantics

`./bootstrap --dry-run` must be truly non-mutating.

It may inspect installed packages and local files, then print planned operations. It must not synchronize Pacman package databases just to calculate missing packages.

It should clearly separate:

```text
Official repository packages
AUR packages
External user dependencies
Runtime initialization
Stow operations
Interactive account/setup steps
```

## 11. Session/service ownership

Do not manually start every desktop service from bootstrap.

Use normal packaged/session ownership:

- portals: systemd/D-Bus graphical-session infrastructure;
- PipeWire/WirePlumber: packaged user service/socket/session infrastructure;
- GNOME Keyring: packaged user service/D-Bus activation;
- hyprpolkitagent: session/Hyprland startup configuration;
- Quickshell: session/Hyprland startup configuration;
- hyprlock: on demand.

Do not add legacy custom graphical-session target workarounds unless current evidence requires them.

## 12. Doctor contract

`./doctor` observes; it never silently repairs.

`./doctor --static` should work outside an active Hyprland session and validate repository/config/package/tooling state that does not require the compositor.

Default `./doctor` should additionally inspect the live desktop when available.

Check domains:

### Packages/runtime

- required Pacman/AUR executables;
- OMZ location;
- Node/pnpm through mise;
- uv;
- Rust stable + rust-analyzer;
- Go;
- Bun;
- Pi and agent executables.

### Dotfiles

- expected Stow links;
- no broken links;
- source points into the active dotfiles repository;
- host profile exists where required.

### Desktop

When in Hyprland:

- Hyprland version;
- Quickshell version/running state;
- Ghostty version;
- Qt/QML tool availability;
- hyprpolkitagent;
- portals;
- PipeWire/WirePlumber;
- Secret Service;
- configured vs detected monitors;
- screenshot and clipboard commands.

### Development

- Git/gh;
- Neovim;
- tree-sitter CLI;
- `lua-language-server`;
- `qmlls6` or `/usr/lib/qt6/bin/qmlls`;
- Clang/CMake/Ninja;
- ShellCheck/shfmt.

### Informational, not hard failures

- Git identity absent;
- GitHub not authenticated;
- Claude/Codex/OpenCode/Pi not authenticated;
- NvChad has not completed first-run hydration;
- VS Code sync absent.

Version drift from the implementation-reference baseline should normally produce a warning and prompt revalidation, not an automatic downgrade.

## 13. Update contract

`./update` deliberately advances externally managed workstation software. It does not update dotfiles source automatically.

Normal sequence should be approximately:

```text
sudo pacman -Syu
paru -Sua
mise upgrade
rustup update stable
npm update/install Pi under mise Node
Oh My Zsh explicit upgrade script
./doctor
```

NvChad/plugin updates remain configuration development: update through Neovim/lazy, inspect the result and lockfile, and commit accepted changes.

`./update --dry-run` should use safe read-only mechanisms such as `checkupdates`, `paru -Qua`, and mise dry-run support rather than synchronizing the live Pacman database.

## 14. Initial fresh-machine runbook

After the user has established a working Arch/Hyprland machine:

```text
sudo pacman -Syu --needed git
mkdir -p ~/src
git clone <dotfiles-repository> ~/src/dotfiles
cd ~/src/dotfiles
./bootstrap --dry-run
./bootstrap
```

Then:

1. inspect monitors with `hyprctl monitors`;
2. create/select the host profile;
3. log out and back into Hyprland;
4. launch `nvim` once so NvChad can hydrate;
5. authenticate GitHub and agent/application accounts as desired;
6. run `./doctor`;
7. perform the desktop real-machine validation pass described by the desktop-shell implementation brief.

## 15. Explicitly out of baseline

Install on demand rather than preloading the workstation with every ecosystem:

- Docker/Podman;
- Kubernetes tooling;
- cloud provider CLIs;
- Terraform/OpenTofu;
- JDK;
- .NET SDK;
- Zig;
- Ruby/PHP toolchains;
- database servers and DB GUIs;
- API GUI clients;
- VM/libvirt/QEMU stack;
- tmux/zellij.

Add one when a real project/workflow calls for it.
