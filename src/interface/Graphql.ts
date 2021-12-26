import {gql} from 'apollo-angular';

export const REGISTER = gql`
  mutation ($addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String], $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float,  $dfi: Float, $dfiInStaking: Float, $btc: Float, $bch: Float, $eth: Float, $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float,
    $qqq: Float, $spy: Float, $pltr: Float, $slv: Float, $aapl: Float, $gld: Float, $gme: Float, $googl: Float,  $ark: Float, $baba: Float,    $vnq: Float,    $urth: Float,
    $tlt: Float, $pdbc: Float, $spyusd: Float,  $qqqusd: Float, $pltrusd: Float, $slvusd: Float, $aaplusd: Float,  $gldusd: Float,  $gmeusd: Float,   $googlusd: Float,
    $arkkusd: Float, $babausd: Float,  $vnqusd: Float,  $urthusd: Float,  $tltusd: Float,   $pdbcusd: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float, $bchInBchPool: Float, $dfiInBchPool: Float,
    $tslaInTslaPool: Float, $usdInTslaPool: Float
    $qqqInQqqPool: Float, $usdInQqqPool: Float, $spyInSpyPool: Float, $usdInSpyPool: Float, $pltrInPltrPool: Float, $usdInPltrPool: Float, $slvInSlvPool: Float,
    $usdInSlvPool: Float, $aaplInAaplPool: Float,  $usdInAaplPool: Float, $gldInGldPool: Float, $usdInGldPool: Float, $gmeInGmePool: Float, $usdInGmePool: Float,
    $googlInGooglPool: Float, $usdInGooglPool: Float, $arkkInArkkPool: Float, $usdInArkkPool: Float, $babaInBabaPool: Float, $usdInBabaPool: Float,
    $vnqInVnqPool: Float, $usdInVnqPool: Float, $urthInUrthPool: Float, $usdInUrthPool: Float, $tltInTltPool: Float, $usdInTltPool: Float, $pdbcInPdbcPool: Float,
    $usdInPdbcPool: Float){
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
          qqq: $qqq
          spy: $spy
          pltr: $pltr
          slv: $slv
          aapl: $aapl
          gld: $gld
          gme: $gme
          googl: $googl
          arkk: $ark
          baba: $baba
          vnq: $vnq
          urth: $urth
          tlt: $tlt
          pdbc: $pdbc
          spyusd: $spyusd
          qqqusd: $qqqusd
          pltrusd: $pltrusd
          slvusd: $slvusd
          aaplusd: $aaplusd
          gldusd: $gldusd
          gmeusd: $gmeusd
          googlusd: $googlusd
          arkkusd: $arkkusd
          babausd: $babausd
          vnqusd: $vnqusd
          urthusd: $urthusd
          tltusd: $tltusd
          pdbcusd: $pdbcusd
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
          qqqInQqqPool: $qqqInQqqPool
          usdInQqqPool: $usdInQqqPool
          spyInSpyPool: $spyInSpyPool
          usdInSpyPool: $usdInSpyPool
          pltrInPltrPool: $pltrInPltrPool
          usdInPltrPool: $usdInPltrPool
          slvInSlvPool: $slvInSlvPool
          usdInSlvPool: $usdInSlvPool
          aaplInAaplPool: $aaplInAaplPool
          usdInAaplPool: $usdInAaplPool
          gldInGldPool: $gldInGldPool
          usdInGldPool: $usdInGldPool
          gmeInGmePool: $gmeInGmePool
          usdInGmePool: $usdInGmePool
          googlInGooglPool: $googlInGooglPool
          usdInGooglPool: $usdInGooglPool
          arkkInArkkPool: $arkkInArkkPool
          usdInArkkPool: $usdInArkkPool
          babaInBabaPool: $babaInBabaPool
          usdInBabaPool: $usdInBabaPool
          vnqInVnqPool: $vnqInVnqPool
          usdInVnqPool: $usdInVnqPool
          urthInUrthPool: $urthInUrthPool
          usdInUrthPool: $usdInUrthPool
          tltInTltPool: $tltInTltPool
          usdInTltPool: $usdInTltPool
          pdbcInPdbcPool: $pdbcInPdbcPool
          usdInPdbcPool: $usdInPdbcPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
      dfi, dfiInStaking, btc, bch, eth, doge, usdt, usdc, usd, ltc, tsla,
      qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc,
      spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
      btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool, dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool, usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
      qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
      aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
      arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
      tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool
    }
    }
  }
`;

export const UPDATE = gql`
  mutation ($key: String!, $addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String],  $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float,  $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float, $dfi: Float, $dfiInStaking: Float, $bch: Float, $btc: Float, $eth: Float, $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float
    $qqq: Float, $spy: Float, $pltr: Float, $slv: Float, $aapl: Float, $gld: Float, $gme: Float, $googl: Float,  $ark: Float, $baba: Float,    $vnq: Float,    $urth: Float,
    $tlt: Float, $pdbc: Float, $spyusd: Float,  $qqqusd: Float, $pltrusd: Float, $slvusd: Float, $aaplusd: Float,  $gldusd: Float,  $gmeusd: Float,   $googlusd: Float,
    $arkkusd: Float, $babausd: Float,  $vnqusd: Float,  $urthusd: Float,  $tltusd: Float,   $pdbcusd: Float
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float, $usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float,
    $bchInBchPool: Float, $dfiInBchPool: Float, $tslaInTslaPool: Float, $usdInTslaPool: Float,
    $qqqInQqqPool: Float, $usdInQqqPool: Float, $spyInSpyPool: Float, $usdInSpyPool: Float, $pltrInPltrPool: Float, $usdInPltrPool: Float, $slvInSlvPool: Float,
    $usdInSlvPool: Float, $aaplInAaplPool: Float,  $usdInAaplPool: Float, $gldInGldPool: Float, $usdInGldPool: Float, $gmeInGmePool: Float, $usdInGmePool: Float,
    $googlInGooglPool: Float, $usdInGooglPool: Float, $arkkInArkkPool: Float, $usdInArkkPool: Float, $babaInBabaPool: Float, $usdInBabaPool: Float,
    $vnqInVnqPool: Float, $usdInVnqPool: Float, $urthInUrthPool: Float, $usdInUrthPool: Float, $tltInTltPool: Float, $usdInTltPool: Float, $pdbcInPdbcPool: Float,
    $usdInPdbcPool: Float
  ){
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
          qqq: $qqq
          spy: $spy
          pltr: $pltr
          slv: $slv
          aapl: $aapl
          gld: $gld
          gme: $gme
          googl: $googl
          arkk: $ark
          baba: $baba
          vnq: $vnq
          urth: $urth
          tlt: $tlt
          pdbc: $pdbc
          spyusd: $spyusd
          qqqusd: $qqqusd
          pltrusd: $pltrusd
          slvusd: $slvusd
          aaplusd: $aaplusd
          gldusd: $gldusd
          gmeusd: $gmeusd
          googlusd: $googlusd
          arkkusd: $arkkusd
          babausd: $babausd
          vnqusd: $vnqusd
          urthusd: $urthusd
          tltusd: $tltusd
          pdbcusd: $pdbcusd
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
          qqqInQqqPool: $qqqInQqqPool
          usdInQqqPool: $usdInQqqPool
          spyInSpyPool: $spyInSpyPool
          usdInSpyPool: $usdInSpyPool
          pltrInPltrPool: $pltrInPltrPool
          usdInPltrPool: $usdInPltrPool
          slvInSlvPool: $slvInSlvPool
          usdInSlvPool: $usdInSlvPool
          aaplInAaplPool: $aaplInAaplPool
          usdInAaplPool: $usdInAaplPool
          gldInGldPool: $gldInGldPool
          usdInGldPool: $usdInGldPool
          gmeInGmePool: $gmeInGmePool
          usdInGmePool: $usdInGmePool
          googlInGooglPool: $googlInGooglPool
          usdInGooglPool: $usdInGooglPool
          arkkInArkkPool: $arkkInArkkPool
          usdInArkkPool: $usdInArkkPool
          babaInBabaPool: $babaInBabaPool
          usdInBabaPool: $usdInBabaPool
          vnqInVnqPool: $vnqInVnqPool
          usdInVnqPool: $usdInVnqPool
          urthInUrthPool: $urthInUrthPool
          usdInUrthPool: $usdInUrthPool
          tltInTltPool: $tltInTltPool
          usdInTltPool: $usdInTltPool
          pdbcInPdbcPool: $pdbcInPdbcPool
          usdInPdbcPool: $usdInPdbcPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
      dfi, dfiInStaking, btc,eth, doge, usdt, usdc, usd, ltc, bch, tsla,
      qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc,
      spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
      btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool,  dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
      qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
      aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
      arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
      tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool
    }
    }
  }
`;

export const LOGIN = gql`
  query ($key: String) {
    userByKey(key: $key) {
      id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
        dfi, dfiInStaking, btc, eth, doge, usdt, usdc, usd, ltc, bch, tsla,
        qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc,
        spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
        btcdfi, ethdfi,dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
        btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool
        dfiInUsdtPool, dfiInUsdcPool, ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
        bchInBchPool,dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
        qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
        aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
        arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
        tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool
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

export const INCOME_STATISTICS = gql`
  query {
    getStatisticsIncome {
      users, addresses, addressesMasternodes, visits
    }
  }
`;

export const HISTORY = gql`
  query {
      getFarmingHistory (
          from : {year: 2021, month:12, day:20, hour: 0, min: 0,s: 0},
          till : {year: 2021, month:12, day:26, hour: 0, min: 0,s: 0}) {

    date, tvl, pools {id,symbol,name, pair,priceA, priceB, reserveA, reserveB,
    volumeA, volumeB, tokenASymbol, tokenBSymbol, volumeA30, volumeB30,
    poolPairId, totalLiquidity, totalLiquidityLpToken }
    }
  }
`;


