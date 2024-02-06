const getResource = () => {
  return {
    [Symbol.dispose]() {
      console.log("disposed outer");
    },
    getInstance() {
      return {
        [Symbol.dispose]() {
          console.log("disposed inner");
        },
      };
    },
  };
};

console.log("before");

{
  console.log("before await");
  using resource = getResource();
  console.log("after first await");
  // await using instance = resource.getInstance();
  console.log("after second await");
}

console.log("before");
