const ethToUsd = 5000;
const weiInEth = BigInt("1000000000000000000"); // Number of wei in 1 ETH

// Function to convert USD to wei
export function usdToWei(usd) {
  const eth = usd / ethToUsd;
  const wei = BigInt(Math.floor(eth * Number(weiInEth)));
  return wei;
}
