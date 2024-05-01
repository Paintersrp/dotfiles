return {
  "stevearc/conform.nvim",
  event = { "BufReadPre" },
  opts = {
    formatters_by_ft = {
      css = { "prettierd" },
      go = { "golines" },
      graphql = { "prettierd" },
      html = { "prettierd" },
      javascript = { "prettierd" },
      javascriptreact = { "prettierd" },
      json = { "prettierd" },
      lua = { "stylua" },
      markdown = { "prettierd" },
      php = { "php_cs_fixer" },
      python = function(bufnr)
        if require("conform").get_formatter_info("ruff_format", bufnr).available then
          return { "ruff_format", "ruff_fix" }
        else
          return { "isort", "black" }
        end
      end,
      rust = { "rustfmt" },
      scss = { "prettierd" },
      sh = { "shfmt" },
      toml = { "taplo" },
      typescript = { "prettierd" },
      typescriptreact = { "prettierd" },
      yaml = { "prettierd" },
    },
    formatters = {
      php_cs_fixer = {
        args = { "fix", "$FILENAME", "--rules=-@PSR12,@Symfony,array_indentation" },
      },
      ruff_fix = {
        args = { "--fix", "--select", "I", "-e", "-n", "--stdin-filename", "$FILENAME", "-" },
      },
      golines = {
        prepend_args = { "--max-len=90" },
      },
    },
    format_on_save = function(bufnr)
      if vim.g.disable_autoformat or vim.b[bufnr].disable_autoformat then
        return
      end
      return { timeout_ms = 5000, lsp_fallback = true }
    end,
  },
}
