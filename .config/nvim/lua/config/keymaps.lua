-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local keymap = vim.keymap
local opts = { noremap = true, silent = true }

keymap.set("i", "jj", "<Esc>")
keymap.set("i", "jk", "<Esc>")

keymap.set("v", "J", ":m '>+1<CR>gv=gv")
keymap.set("v", "K", ":m '<-2<CR>gv=gv")

keymap.set("n", "<left>", '<cmd>echo "Use h to move!!"<CR>')
keymap.set("n", "<right>", '<cmd>echo "Use l to move!!"<CR>')
keymap.set("n", "<up>", '<cmd>echo "Use k to move!!"<CR>')
keymap.set("n", "<down>", '<cmd>echo "Use j to move!!"<CR>')

keymap.set("n", "x", '"_x')
keymap.set("n", "<Leader>p", '"0p')
keymap.set("n", "<Leader>P", '"0P')
keymap.set("v", "<Leader>p", '"0p')
keymap.set("n", "<Leader>c", '"_c')
keymap.set("n", "<Leader>C", '"_C')
keymap.set("v", "<Leader>c", '"_c')
keymap.set("v", "<Leader>C", '"_C')
keymap.set("n", "<Leader>d", '"_d')
keymap.set("n", "<Leader>D", '"_D')
keymap.set("v", "<Leader>d", '"_d')
keymap.set("v", "<Leader>D", '"_D')

-- Increment/decrement
keymap.set("n", "+", "<C-a>")
keymap.set("n", "-", "<C-x>")

-- Select all
keymap.set("n", "<C-a>", "gg<S-v>G")

-- -- Split window
keymap.set("n", "ss", ":split<Return>", opts)
keymap.set("n", "sv", ":vsplit<Return>", opts)

-- -- Clear Search
keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>")

-- Diagnostic
keymap.set("n", "[d", vim.diagnostic.goto_prev, { desc = "Go to previous [D]iagnostic message" })
keymap.set("n", "]d", vim.diagnostic.goto_next, { desc = "Go to next [D]iagnostic message" })
keymap.set("n", "<leader>r", vim.diagnostic.open_float, { desc = "Show diagnostic [E]rror messages" })
keymap.set("n", "<leader>q", vim.diagnostic.setloclist, { desc = "Open diagnostic [Q]uickfix list" })

-- Atomic Notes
keymap.set("n", "<Leader>re", ":<C-u>!an echo ", opts)
-- keymap.set("n", "<Leader>rE", ":<C-u>!an op<CR>", opts)
keymap.set("n", "<Leader>rt", ":<C-u>!an tasks echo ", opts)
-- keymap.set("n", "<Leader>rT", ":<C-u>!alacritty an tasks op<CR>", opts)

keymap.set("n", "<Leader>t", "/\\[ \\]<CR>", opts)

keymap.set("n", "gst", "<Cmd>MDListItemBelow<CR>", opts)
keymap.set("n", "gsa", "<Cmd>MDListItemAbove<CR>", opts)
keymap.set("n", "gsf", "<Cmd>MDTaskToggle<CR>", opts)
keymap.set("x", "gsf", ":MDTaskToggle<CR>", opts)

keymap.set("n", "<leader>ee", "oif err != nil {<CR>}<Esc>Oreturn err<Esc>")
keymap.set("n", "<leader>ph", "o> [!todo]<CR>> [[Placeholder]] words here.<Esc>", opts)
