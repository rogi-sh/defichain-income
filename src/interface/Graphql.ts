import {gql} from 'apollo-angular';

export const REGISTER = gql`
  mutation ($addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String], $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float,  $dfi: Float, $dfiInStaking: Float, $btc: Float, $bch: Float, $eth: Float, $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float,
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float, $bchInBchPool: Float, $dfiInBchPool: Float,
    $tslaInTslaPool: Float, $usdInTslaPool: Float){
    addUser (
      user : {
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        adressesMasternodesFreezer5: $adressesMasternodesFreezer5
        adressesMasternodesFreezer10: $adressesMasternodesFreezer10
        wallet : {
          btcdfi :$btcdfi
          ethdfi: $ethdfi
          dogedfi: $dogedfi
          ltcdfi: $ltcdfi
          usdtdfi: $usdtdfi
          usdcdfi: $usdcdfi
          bchdfi: $bchdfi
          usddfi: $usddfi
          tslausd: $tslausd
          dfi: $dfi
          dfiInStaking: $dfiInStaking
          btc: $btc
          eth: $eth
          doge: $doge
          usdt: $usdt
          usdc: $usdc
          ltc: $ltc
          bch: $bch
          usd: $usd
          tsla: $tsla
          btcInBtcPool: $btcInBtcPool
          dfiInBtcPool: $dfiInBtcPool
          ethInEthPool: $ethInEthPool
          dfiInEthPool: $dfiInEthPool
          usdtInUsdtPool: $usdtInUsdtPool
          dfiInUsdtPool: $dfiInUsdtPool
          usdcInUsdcPool: $usdcInUsdcPool
          usdInUsdPool: $usdInUsdPool
          dfiInUsdPool: $dfiInUsdPool
          dfiInUsdcPool: $dfiInUsdcPool
          ltcInLtcPool: $ltcInLtcPool
          dfiInLtcPool: $dfiInLtcPool
          dogeInDogePool: $dogeInDogePool
          dfiInDogePool: $dfiInDogePool
          bchInBchPool: $bchInBchPool
          dfiInBchPool: $dfiInBchPool
          tslaInTslaPool: $tslaInTslaPool
          usdInTslaPool: $usdInTslaPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
      dfi, dfiInStaking, btc, bch, eth, doge, usdt, usdc, usd, ltc, tsla,
      btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool, dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool, usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool
    }
    }
  }
`;

export const UPDATE = gql`
  mutation ($key: String!, $addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String],  $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float,  $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float, $dfi: Float, $dfiInStaking: Float, $bch: Float, $btc: Float, $eth: Float, $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float, $usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float,
    $bchInBchPool: Float, $dfiInBchPool: Float, $tslaInTslaPool: Float, $usdInTslaPool: Float){
    updateUser (
      user : {
        key: $key
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        adressesMasternodesFreezer5: $adressesMasternodesFreezer5
        adressesMasternodesFreezer10: $adressesMasternodesFreezer10
        wallet : {
          btcdfi :$btcdfi
          ethdfi: $ethdfi
          dogedfi: $dogedfi
          ltcdfi: $ltcdfi
          usdtdfi: $usdtdfi
          usdcdfi: $usdcdfi
          bchdfi: $bchdfi
          usddfi: $usddfi
          tslausd: $tslausd
          dfi: $dfi
          dfiInStaking: $dfiInStaking
          btc: $btc
          eth: $eth
          doge: $doge
          usdt: $usdt
          usdc: $usdc
          ltc: $ltc
          bch: $bch
          usd: $usd
          tsla: $tsla
          btcInBtcPool: $btcInBtcPool
          dfiInBtcPool: $dfiInBtcPool
          ethInEthPool: $ethInEthPool
          dfiInEthPool: $dfiInEthPool
          usdtInUsdtPool: $usdtInUsdtPool
          dfiInUsdtPool: $dfiInUsdtPool
          usdcInUsdcPool: $usdcInUsdcPool
          dfiInUsdcPool: $dfiInUsdcPool
          usdInUsdPool: $usdInUsdPool
          dfiInUsdPool: $dfiInUsdPool
          ltcInLtcPool: $ltcInLtcPool
          dfiInLtcPool: $dfiInLtcPool
          dogeInDogePool: $dogeInDogePool
          dfiInDogePool: $dfiInDogePool
          bchInBchPool: $bchInBchPool
          dfiInBchPool: $dfiInBchPool
          tslaInTslaPool: $tslaInTslaPool
          usdInTslaPool: $usdInTslaPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
      dfi, dfiInStaking, btc,eth, doge, usdt, usdc, usd, ltc, bch, tsla,
      btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool,  dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool
    }
    }
  }
`;

export const LOGIN = gql`
  query ($key: String) {
    userByKey(key: $key) {
      id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
        dfi, dfiInStaking, btc,eth, doge, usdt, usdc, usd, ltc, bch, tsla,
        btcdfi, ethdfi,dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
        btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool
        dfiInUsdtPool, dfiInUsdcPool, ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
        bchInBchPool,dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool
      }
    }
  }
`;

export const CORRELATION = gql`
  query ($days: Int){
    getCorrelation(days: $days) {
      btcPool, ethPool, ltcPool, dogePool, bchPool, dogePool, usdtPool, usdcPool, usdPool, tslaPool
    }
  }
`;



