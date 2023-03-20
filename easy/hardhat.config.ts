import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-spdx-license-identifier'

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
}

export default config
