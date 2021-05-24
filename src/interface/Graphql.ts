import {gql} from 'apollo-angular';

export const REGISTER = gql`
  mutation ($addresses: [String], $addressesMasternodes: [String], $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $bchdfi: Float, $dfi: Float, $dfiInStaking: Float, $btc: Float, $bch: Float, $eth: Float, $doge: Float, $usdt: Float, $ltc: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float,
    $dfiInUsdtPool: Float,$ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float, $bchInBchPool: Float, $dfiInBchPool: Float ){
    addUser (
      user : {
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        wallet : {
          btcdfi :$btcdfi
          ethdfi: $ethdfi
          dogedfi: $dogedfi
          ltcdfi: $ltcdfi
          usdtdfi: $usdtdfi
          bchdfi: $bchdfi
          dfi: $dfi
          dfiInStaking: $dfiInStaking
          btc: $btc
          eth: $eth
          doge: $doge
          usdt: $usdt
          ltc: $ltc
          bch: $bch
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
          bchInBchPool: $bchInBchPool
          dfiInBchPool: $dfiInBchPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, wallet {
      dfi, dfiInStaking, btc, bch, eth, doge, usdt, ltc,
      btcdfi , ethdfi,dogedfi, ltcdfi,usdtdfi, bchdfi,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,
      dfiInUsdtPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool
    }
    }
  }
`;

export const UPDATE = gql`
  mutation ($key: String!, $addresses: [String], $addressesMasternodes: [String],  $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $bchdfi: Float,  $dfi: Float, $dfiInStaking: Float, $bch: Float, $btc: Float, $eth: Float, $doge: Float, $usdt: Float, $ltc: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float,
    $dfiInUsdtPool: Float,$ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float,
    $bchInBchPool: Float, $dfiInBchPool: Float){
    updateUser (
      user : {
        key: $key
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        wallet : {
          btcdfi :$btcdfi
          ethdfi: $ethdfi
          dogedfi: $dogedfi
          ltcdfi: $ltcdfi
          usdtdfi: $usdtdfi
          bchdfi: $bchdfi
          dfi: $dfi
          dfiInStaking: $dfiInStaking
          btc: $btc
          eth: $eth
          doge: $doge
          usdt: $usdt
          ltc: $ltc
          bch: $bch
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
          bchInBchPool: $bchInBchPool
          dfiInBchPool: $dfiInBchPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, wallet {
      dfi, dfiInStaking, btc,eth, doge, usdt, ltc, bch
      btcdfi , ethdfi,dogedfi, ltcdfi, usdtdfi, bchdfi,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,
      dfiInUsdtPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool,dfiInBchPool
    }
    }
  }
`;

export const LOGIN = gql`
  query ($key: String) {
    userByKey(key: $key) {
      id, key, addresses, addressesMasternodes,  wallet {
        dfi, dfiInStaking, btc,eth, doge, usdt, ltc, bch,
        btcdfi , ethdfi,dogedfi, ltcdfi, usdtdfi, bchdfi,
        btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,
        dfiInUsdtPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
        bchInBchPool,dfiInBchPool
      }
    }
  }
`;

export const CORRELATION = gql`
  query {
    getCorrelation {
      btcPool, ethPool, ltcPool, dogePool, bchPool, dogePool, usdtPool
    }
  }
`;



