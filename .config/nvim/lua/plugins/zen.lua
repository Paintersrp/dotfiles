return {
  -- add symbols-outline
  -- {
  --   "shortcuts/no-neck-pain.nvim",
  --   cmd = "NoNeckPain",
  --   keys = { { "<leader>zz", "<cmd>NoNeckPain<cr>", desc = "[N]o [N]eckpain" } },
  --   opts = {
  --     width = 120,
  --     linebreak = true,
  --     bufferOptionsColors = {},
  --   },
  -- },
  {
    "folke/zen-mode.nvim",
    cmd = "ZenMode",
    opts = {
      plugins = {
        gitsigns = true,
        tmux = true,
      },
    },
    keys = {
      { "<leader>z", "<cmd>ZenMode<cr>", desc = "Zen Mode" },
    },
  },
}
