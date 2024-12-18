document.addEventListener("DOMContentLoaded", () => {
  const car = document.querySelector(".car-animation");

  // Trigger animation after a short delay
  setTimeout(() => {
    car.style.transform = "translateX(80vw)"; // Adjust the end position
  }, 500); // Delay to make the animation smoother

  // Make the car clickable to redirect to /menu
  car.addEventListener("click", () => {
    window.location.href = "/menu";
  });
});
