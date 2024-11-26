export function parseInput(inputs: any) {
  // We get the inputs and format it
  let amount = inputs.amount ? parseInt(inputs.amount) : 5000;
  let duration = inputs?.duration ? parseInt(inputs.duration.match(/\d+/)) : 24;

  return {
    duration: duration,
    amount: amount,
  };
}
