export const scrollToCatalogue = (
  behavior: "smooth" | "auto" | "instant" = "instant"
) => {
  const catalogue = document.getElementById("discover");
  if (catalogue) {
    catalogue.scrollIntoView({ behavior: behavior });
  }
};
