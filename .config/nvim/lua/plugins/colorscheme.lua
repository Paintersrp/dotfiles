-- return {
--   {
--     "folke/tokyonight.nvim",
--     opts = {
--       transparent = true,
--       styles = {
--         sidebars = "transparent",
--         floats = "transparent",
--       },
--     },
--   },
-- }
return {
  "folke/tokyonight.nvim",
  lazy = false,
  priority = 1000,
  opts = {
    style = "moon", -- The theme comes in three styles, `storm`, `moon`, a darker variant `night` and `day`
    transparent = true, -- Enable this to disable setting the background color
    styles = {
      comments = { italic = true },
      keywords = { italic = true },
      functions = {},
      variables = {},
      sidebars = "transparent", -- style for sidebars, see below
      floats = "transparent", -- style for floating windows
    },
    sidebars = { "qf", "help" }, -- Set a darker background on sidebar-like windows. For example: `["qf", "vista_kind", "terminal", "packer"]`
    hide_inactive_statusline = false, -- Enabling this option, will hide inactive statuslines and replace them with a thin border instead. Should work with the standard **StatusLine** and **LuaLine**.
    lualine_bold = false, -- When `true`, section headers in the lualine theme will be bold
  },
}
-- return {
--   "craftzdog/solarized-osaka.nvim",
--   lazy = false,
--   priority = 1000,
--   opts = {},
-- }
-- return {
--   "catppuccin/nvim",
--   lazy = true,
--   name = "catppuccin",
--   opts = {
--     flavour = "mocha",
--     transparent_background = true,
--     integrations = {
--       aerial = true,
--       alpha = true,
--       cmp = true,
--       dashboard = true,
--       flash = true,
--       gitsigns = true,
--       headlines = true,
--       illuminate = true,
--       indent_blankline = { enabled = true },
--       leap = true,
--       lsp_trouble = true,
--       mason = true,
--       markdown = true,
--       mini = true,
--       native_lsp = {
--         enabled = true,
--         underlines = {
--           errors = { "undercurl" },
--           hints = { "undercurl" },
--           warnings = { "undercurl" },
--           information = { "undercurl" },
--         },
--       },
--       navic = { enabled = true, custom_bg = "lualine" },
--       neotest = true,
--       neotree = true,
--       noice = true,
--       notify = true,
--       semantic_tokens = true,
--       telescope = true,
--       treesitter = true,
--       treesitter_context = true,
--       which_key = true,
--     },
--   },
-- }
