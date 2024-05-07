local M = {
  "stevearc/oil.nvim",
  dependencies = { "nvim-tree/nvim-web-devicons" },
}

function M.config()
  require("oil").setup({
    float = {
      max_height = 30,
      max_width = 90,
    },
  })
  vim.keymap.set("n", "_", "<CMD>Oil --float<CR>", { desc = "Open parent directory" })
end

return M
