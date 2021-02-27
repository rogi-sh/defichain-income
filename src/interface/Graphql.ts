import {gql} from 'apollo-angular';

export const REGISTER = gql`
  mutation ($addresses: [String], $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $dfi: Float, $btc: Float, $eth: Float, $doge: Float, $usdt: Float, $ltc: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float,
    $dfiInUsdtPool: Float,$ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float ){
    addUser (
      user : {
        addresses : $addresses
        wallet : {
          btcdfi :$btcdfi
          ethdfi: $ethdfi
          dogedfi: $dogedfi
          ltcdfi: $ltcdfi
          usdtdfi: $usdtdfi
          dfi: $dfi
          btc: $btc
          eth: $eth
          doge: $doge
          usdt: $usdt
          ltc: $ltc
          btcInBtcPool: $btcInBtcPool
          dfiInBtcPool: $dfiInBtcPool
          ethInEthPool: $ethInEthPool
          dfiInEthPool: $dfiInEthPool
          usdtInUsdtPool: $usdtInUsdtPool
          dfiInUsdtPool: $dfiInUsdtPool
          ltcInLtcPool: $ltcInLtcPool
          dfiInLtcPool: $dfiInLtcPool
          dogeInDogePool: $dogeInDogePool
          dfiInDogePool: $dfiInDogePool
        }
      }
    )
    {id, key, addresses, wallet {
      dfi, btc,eth, doge, usdt, ltc,
      btcdfi , ethdfi,dogedfi, ltcdfi,usdtdfi,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,
      dfiInUsdtPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool
    }
    }
  }
`;



