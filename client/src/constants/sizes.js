export const sizes = {
  down(size) {
    const sizes = {
      xxs: "350.98px",
      xs: "575.98px",
      sm: "767.98px",
      md: "991.98px",
      lg: "1199.98px",
      xl: "2000px",
    };
    return `@media (max-width: ${sizes[size]})`;
  },
};
