import {gql} from 'apollo-angular';

export const REGISTER = gql`
  mutation ($addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String],
    $totalValue: Float, $totalValueIncomeDfi: Float, $totalValueIncomeUsd: Float,
    $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float, $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float,  $dfi: Float, $dfiInStaking: Float, $dfiInDfxStaking: Float, $btc: Float, $bch: Float, $eth: Float, $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float,
    $qqq: Float, $spy: Float, $pltr: Float, $slv: Float, $aapl: Float, $gld: Float, $gme: Float, $googl: Float,  $arkk: Float, $baba: Float,    $vnq: Float,    $urth: Float,
    $amzn: Float, $nvda: Float, $coin: Float, $eem: Float, $msft: Float, $nflx: Float, $fb: Float, $voo: Float, $dis: Float, $mchi: Float, $mstr: Float, $intc: Float,
    $pypl: Float, $brkb: Float, $ko: Float, $pg: Float, $sap: Float, $ura: Float, $cs: Float, $gsg: Float, $pplt: Float, $govt: Float, $tan: Float, $xom: Float,
    $jnj: Float, $addyy: Float, $gs: Float, $dax: Float,  $wmt: Float, $ul: Float, $ung: Float, $uso: Float,
    $tlt: Float, $pdbc: Float, $spyusd: Float,  $qqqusd: Float, $pltrusd: Float, $slvusd: Float, $aaplusd: Float,  $gldusd: Float,  $gmeusd: Float,   $googlusd: Float,
    $arkkusd: Float, $babausd: Float,  $vnqusd: Float,  $urthusd: Float,  $tltusd: Float,   $pdbcusd: Float,
    $amznusd: Float,  $nvdausd: Float,  $coinusd: Float, $eemusd: Float, $msftusd: Float,  $nflxusd: Float,  $fbusd: Float, $voousd: Float,
    $disusd: Float, $mchiusd: Float, $mstrusd: Float, $intcusd: Float,  $pyplusd: Float, $brkbusd: Float, $kousd: Float, $pgusd: Float,
    $sapusd: Float, $urausd: Float, $csusd: Float, $gsgusd: Float, $ppltusd: Float, $govtusd: Float, $tanusd: Float, $xomusd: Float,
    $jnjusd: Float, $addyyusd: Float, $gsusd: Float, $daxusd: Float, $wmtusd: Float, $ulusd: Float, $ungusd: Float, $usousd: Float,
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float,$usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float, $bchInBchPool: Float, $dfiInBchPool: Float,
    $tslaInTslaPool: Float, $usdInTslaPool: Float
    $qqqInQqqPool: Float, $usdInQqqPool: Float, $spyInSpyPool: Float, $usdInSpyPool: Float, $pltrInPltrPool: Float, $usdInPltrPool: Float, $slvInSlvPool: Float,
    $usdInSlvPool: Float, $aaplInAaplPool: Float,  $usdInAaplPool: Float, $gldInGldPool: Float, $usdInGldPool: Float, $gmeInGmePool: Float, $usdInGmePool: Float,
    $googlInGooglPool: Float, $usdInGooglPool: Float, $arkkInArkkPool: Float, $usdInArkkPool: Float, $babaInBabaPool: Float, $usdInBabaPool: Float,
    $vnqInVnqPool: Float, $usdInVnqPool: Float, $urthInUrthPool: Float, $usdInUrthPool: Float, $tltInTltPool: Float, $usdInTltPool: Float, $pdbcInPdbcPool: Float,
    $usdInPdbcPool: Float,
    $amznInAmznPool: Float, $usdInAmznPool: Float, $nvdaInNvdaPool: Float, $usdInNvdaPool: Float, $coinInCoinPool: Float, $usdInCoinPool: Float, $eemInEemPool: Float,
    $usdInEemPool: Float,
    $msftInMsftPool: Float, $usdInMsftPool: Float, $nflxInNflxPool: Float, $usdInNflxPool: Float, $fbInFbPool: Float, $usdInFbPool: Float, $vooInVooPool: Float,
    $usdInVooPool: Float
    $disInDisPool: Float, $usdInDisPool: Float, $mchiInMchiPool: Float, $usdInMchiPool: Float, $mstrInMstrPool: Float, $usdInMstrPool: Float, $intcInIntcPool: Float,
    $usdInIntcPool: Float,
    $pyplInPyplPool: Float, $usdInPyplPool: Float, $brkbInBrkbPool: Float,  $usdInBrkbPool: Float, $koInKoPool: Float, $usdInKoPool: Float, $pgInPgPool: Float,
    $usdInPgPool: Float,
    $sapInSapPool: Float, $usdInSapPool: Float, $uraInUraPool: Float,  $usdInUraPool: Float, $csInCsPool: Float, $usdInCsPool: Float, $gsgInGsgPool: Float,
    $usdInGsgPool: Float,
    $ppltInPpltPool: Float, $usdInPpltPool: Float, $govtInGovtPool: Float,  $usdInGovtPool: Float, $tanInTanPool: Float, $usdInTanPool: Float, $xomInXomPool: Float,
    $usdInXomPool: Float,
    $jnjInJnjPool: Float, $usdInJnjPool: Float, $gsInGsPool: Float, $usdInGsPool: Float, $daxInDaxPool: Float, $usdInDaxPool: Float, $addyyInAddyyPool: Float, $usdInAddyyPool: Float,
    $wmtInWmtPool: Float, $usdInWmtPool: Float, $ulInUlPool: Float, $usdInUlPool: Float, $ungInUngPool: Float, $usdInUngPool: Float, $usoInUsoPool: Float, $usdInUsoPool: Float
    ){
    addUser (
      user : {
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        adressesMasternodesFreezer5: $adressesMasternodesFreezer5
        adressesMasternodesFreezer10: $adressesMasternodesFreezer10
        totalValue: $totalValue
        totalValueIncomeDfi: $totalValueIncomeDfi
        totalValueIncomeUsd: $totalValueIncomeUsd
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
          dfiInDfxStaking: $dfiInDfxStaking
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
          arkk: $arkk
          baba: $baba
          vnq: $vnq
          urth: $urth
          tlt: $tlt
          pdbc: $pdbc
          amzn: $amzn
          nvda: $nvda
          coin: $coin
          eem: $eem
          msft: $msft
          nflx: $nflx
          fb: $fb
          voo: $voo
          dis: $dis
          mchi: $mchi
          mstr: $mstr
          intc: $intc
          pypl: $pypl
          brkb: $brkb
          ko: $ko
          pg: $pg
          sap: $sap
          ura: $ura
          cs: $cs
          gsg: $gsg
          pplt: $pplt
          govt: $govt
          tan: $tan
          xom: $xom
          jnj : $jnj
          addyy : $addyy
          gs : $gs
          dax : $dax

          wmt : $wmt
          ul : $ul
          ung : $ung
          uso : $uso
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
          amznusd: $amznusd
          nvdausd: $nvdausd
          coinusd: $coinusd
          eemusd: $eemusd
          msftusd: $msftusd
          nflxusd: $nflxusd
          fbusd: $fbusd
          voousd: $voousd
          disusd: $disusd
          mchiusd: $mchiusd
          mstrusd: $mstrusd
          intcusd: $intcusd
          pyplusd: $pyplusd
          brkbusd: $brkbusd
          kousd: $kousd
          pgusd: $pgusd
          sapusd: $sapusd
          urausd: $urausd
          csusd: $csusd
          gsgusd: $gsgusd
          ppltusd: $ppltusd
          govtusd: $govtusd
          tanusd: $tanusd
          xomusd: $xomusd
          jnjusd  : $jnjusd
          addyyusd  : $addyyusd
          gsusd  : $gsusd
          daxusd  : $daxusd

          wmtusd  : $wmtusd
          ulusd  : $ulusd
          ungusd  : $ungusd
          usousd  : $usousd
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
          amznInAmznPool: $amznInAmznPool
          usdInAmznPool: $usdInAmznPool
          nvdaInNvdaPool: $nvdaInNvdaPool
          usdInNvdaPool: $usdInNvdaPool
          coinInCoinPool: $coinInCoinPool
          usdInCoinPool: $usdInCoinPool
          eemInEemPool: $eemInEemPool
          usdInEemPool: $usdInEemPool
          msftInMsftPool: $msftInMsftPool
          usdInMsftPool: $usdInMsftPool
          nflxInNflxPool: $nflxInNflxPool
          usdInNflxPool: $usdInNflxPool
          fbInFbPool: $fbInFbPool
          usdInFbPool: $usdInFbPool
          vooInVooPool: $vooInVooPool
          usdInVooPool: $usdInVooPool

          disInDisPool: $disInDisPool
          usdInDisPool: $usdInDisPool
          mchiInMchiPool: $mchiInMchiPool
          usdInMchiPool: $usdInMchiPool
          mstrInMstrPool: $mstrInMstrPool
          usdInMstrPool: $usdInMstrPool
          intcInIntcPool: $intcInIntcPool
          usdInIntcPool: $usdInIntcPool

          pyplInPyplPool: $pyplInPyplPool
          usdInPyplPool: $usdInPyplPool
          brkbInBrkbPool: $brkbInBrkbPool
          usdInBrkbPool: $usdInBrkbPool
          koInKoPool: $koInKoPool
          usdInKoPool: $usdInKoPool
          pgInPgPool: $pgInPgPool
          usdInPgPool: $usdInPgPool

          sapInSapPool: $sapInSapPool
          usdInSapPool: $usdInSapPool
          uraInUraPool: $uraInUraPool
          usdInUraPool: $usdInUraPool
          csInCsPool: $csInCsPool
          usdInCsPool: $usdInCsPool
          gsgInGsgPool: $gsgInGsgPool
          usdInGsgPool: $usdInGsgPool

          ppltInPpltPool: $ppltInPpltPool
          usdInPpltPool: $usdInPpltPool
          govtInGovtPool: $govtInGovtPool
          usdInGovtPool: $usdInGovtPool
          tanInTanPool: $tanInTanPool
          usdInTanPool: $usdInTanPool
          xomInXomPool: $xomInXomPool
          usdInXomPool: $usdInXomPool

          jnjInJnjPool : $jnjInJnjPool
          usdInJnjPool : $usdInJnjPool
          gsInGsPool : $gsInGsPool
          usdInGsPool : $usdInGsPool
          daxInDaxPool : $daxInDaxPool
          usdInDaxPool : $usdInDaxPool
          addyyInAddyyPool : $addyyInAddyyPool
          usdInAddyyPool : $usdInAddyyPool

          wmtInWmtPool : $wmtInWmtPool
          usdInWmtPool : $usdInWmtPool
          ulInUlPool : $ulInUlPool
          usdInUlPool : $usdInUlPool
          ungInUngPool : $ungInUngPool
          usdInUngPool : $usdInUngPool
          usoInUsoPool : $usoInUsoPool
          usdInUsoPool : $usdInUsoPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10, wallet {
      dfi, dfiInStaking, dfiInDfxStaking, btc, bch, eth, doge, usdt, usdc, usd, ltc, tsla,
      qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc,
      amzn, nvda, coin, eem, msft, nflx, fb, voo, dis, mchi, mstr, intc,  pypl, brkb, ko, pg,
      sap, ura, cs, gsg, pplt, govt, tan, xom, jnj, addyy, gs, dax,  wmt, ul, ung, uso,
      spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
      amznusd,nvdausd,coinusd, eemusd, msftusd, nflxusd, fbusd, voousd,  disusd, mchiusd, mstrusd, intcusd,
      pyplusd, brkbusd, kousd, pgusd,   sapusd, urausd, csusd, gsgusd,
      btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd, ppltusd, govtusd, tanusd, xomusd,
      jnjusd, addyyusd, gsusd, daxusd, wmtusd, ulusd, ungusd, usousd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool, dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool, usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
      qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
      aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
      arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
      tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool,
      amznInAmznPool, usdInAmznPool,nvdaInNvdaPool,usdInNvdaPool,
      coinInCoinPool,usdInCoinPool,eemInEemPool, usdInEemPool,
      msftInMsftPool, usdInMsftPool,nflxInNflxPool,usdInNflxPool,
      fbInFbPool,usdInFbPool,vooInVooPool, usdInVooPool,
      disInDisPool, usdInDisPool, mchiInMchiPool, usdInMchiPool, mstrInMstrPool, usdInMstrPool, intcInIntcPool, usdInIntcPool,
      pyplInPyplPool, usdInPyplPool, brkbInBrkbPool, usdInBrkbPool, koInKoPool, usdInKoPool, pgInPgPool, usdInPgPool,
      sapInSapPool, usdInSapPool, uraInUraPool, usdInUraPool, csInCsPool, usdInCsPool, gsgInGsgPool, usdInGsgPool,
      ppltInPpltPool, usdInPpltPool, govtInGovtPool,  usdInGovtPool, tanInTanPool, usdInTanPool, xomInXomPool, usdInXomPool,
      jnjInJnjPool, usdInJnjPool, gsInGsPool, usdInGsPool, daxInDaxPool, usdInDaxPool, addyyInAddyyPool, usdInAddyyPool,
      wmtInWmtPool, usdInWmtPool, ulInUlPool, usdInUlPool, ungInUngPool, usdInUngPool, usoInUsoPool, usdInUsoPool
    }
    }
  }
`;

export const UPDATE = gql`
  mutation ($key: String!, $addresses: [String], $addressesMasternodes: [String], $adressesMasternodesFreezer5: [String], $adressesMasternodesFreezer10: [String],
    $totalValue: Float, $totalValueIncomeDfi: Float, $totalValueIncomeUsd: Float,
    $btcdfi: Float, $ethdfi: Float, $dogedfi: Float, $ltcdfi: Float
    $usdtdfi: Float,  $usdcdfi: Float, $usddfi: Float, $bchdfi: Float, $tslausd: Float, $dfi: Float, $dfiInStaking: Float, $dfiInDfxStaking: Float, $bch: Float, $btc: Float, $eth: Float,
    $doge: Float, $usdt: Float, $usdc: Float, $usd: Float, $ltc: Float, $tsla: Float
    $qqq: Float, $spy: Float, $pltr: Float, $slv: Float, $aapl: Float, $gld: Float, $gme: Float, $googl: Float,  $arkk: Float, $baba: Float,  $vnq: Float,    $urth: Float,
    $tlt: Float, $pdbc: Float, $amzn: Float, $nvda: Float, $coin: Float, $eem: Float, $msft: Float, $nflx: Float, $fb: Float, $voo: Float, $dis: Float, $mchi: Float, $mstr: Float, $intc: Float,
    $pypl: Float, $brkb: Float, $ko: Float, $pg: Float, $sap: Float, $ura: Float, $cs: Float, $gsg: Float, $pplt: Float, $govt: Float, $tan: Float, $xom: Float,
    $jnj: Float, $addyy: Float, $gs: Float, $dax: Float,  $wmt: Float, $ul: Float, $ung: Float, $uso: Float,
    $spyusd: Float,  $qqqusd: Float, $pltrusd: Float, $slvusd: Float, $aaplusd: Float,  $gldusd: Float,  $gmeusd: Float,   $googlusd: Float,
    $arkkusd: Float, $babausd: Float,  $vnqusd: Float,  $urthusd: Float,  $tltusd: Float, $pdbcusd: Float,
    $amznusd: Float,  $nvdausd: Float,  $coinusd: Float, $eemusd: Float, $msftusd: Float,  $nflxusd: Float,  $fbusd: Float, $voousd: Float,
    $disusd: Float, $mchiusd: Float, $mstrusd: Float, $intcusd: Float,
    $pyplusd: Float, $brkbusd: Float, $kousd: Float, $pgusd: Float,  $sapusd: Float, $urausd: Float, $csusd: Float, $gsgusd: Float,
    $ppltusd: Float, $govtusd: Float, $tanusd: Float, $xomusd: Float,
    $jnjusd: Float, $addyyusd: Float, $gsusd: Float, $daxusd: Float, $wmtusd: Float, $ulusd: Float, $ungusd: Float, $usousd: Float,
    $btcInBtcPool: Float, $dfiInBtcPool: Float, $ethInEthPool: Float, $dfiInEthPool: Float, $usdtInUsdtPool: Float, $usdcInUsdcPool: Float, $usdInUsdPool: Float,
    $dfiInUsdtPool: Float, $dfiInUsdcPool: Float, $dfiInUsdPool: Float, $ltcInLtcPool: Float, $dfiInLtcPool: Float, $dogeInDogePool: Float, $dfiInDogePool: Float,
    $bchInBchPool: Float, $dfiInBchPool: Float, $tslaInTslaPool: Float, $usdInTslaPool: Float,
    $qqqInQqqPool: Float, $usdInQqqPool: Float, $spyInSpyPool: Float, $usdInSpyPool: Float, $pltrInPltrPool: Float, $usdInPltrPool: Float, $slvInSlvPool: Float,
    $usdInSlvPool: Float, $aaplInAaplPool: Float,  $usdInAaplPool: Float, $gldInGldPool: Float, $usdInGldPool: Float, $gmeInGmePool: Float, $usdInGmePool: Float,
    $googlInGooglPool: Float, $usdInGooglPool: Float, $arkkInArkkPool: Float, $usdInArkkPool: Float, $babaInBabaPool: Float, $usdInBabaPool: Float,
    $vnqInVnqPool: Float, $usdInVnqPool: Float, $urthInUrthPool: Float, $usdInUrthPool: Float, $tltInTltPool: Float, $usdInTltPool: Float, $pdbcInPdbcPool: Float,
    $usdInPdbcPool: Float,
    $amznInAmznPool: Float, $usdInAmznPool: Float, $nvdaInNvdaPool: Float, $usdInNvdaPool: Float, $coinInCoinPool: Float, $usdInCoinPool: Float, $eemInEemPool: Float,
    $usdInEemPool: Float,
    $msftInMsftPool: Float, $usdInMsftPool: Float, $nflxInNflxPool: Float, $usdInNflxPool: Float, $fbInFbPool: Float, $usdInFbPool: Float, $vooInVooPool: Float,
    $usdInVooPool: Float,
    $disInDisPool: Float, $usdInDisPool: Float, $mchiInMchiPool: Float, $usdInMchiPool: Float, $mstrInMstrPool: Float, $usdInMstrPool: Float, $intcInIntcPool: Float,
    $usdInIntcPool: Float,
    $pyplInPyplPool: Float, $usdInPyplPool: Float, $brkbInBrkbPool: Float,  $usdInBrkbPool: Float, $koInKoPool: Float, $usdInKoPool: Float, $pgInPgPool: Float,
    $usdInPgPool: Float,
    $sapInSapPool: Float, $usdInSapPool: Float, $uraInUraPool: Float,  $usdInUraPool: Float, $csInCsPool: Float, $usdInCsPool: Float, $gsgInGsgPool: Float,
    $usdInGsgPool: Float,
    $ppltInPpltPool: Float, $usdInPpltPool: Float, $govtInGovtPool: Float,  $usdInGovtPool: Float, $tanInTanPool: Float, $usdInTanPool: Float, $xomInXomPool: Float,
    $usdInXomPool: Float,
    $jnjInJnjPool: Float, $usdInJnjPool: Float, $gsInGsPool: Float, $usdInGsPool: Float, $daxInDaxPool: Float, $usdInDaxPool: Float, $addyyInAddyyPool: Float, $usdInAddyyPool: Float,
    $wmtInWmtPool: Float, $usdInWmtPool: Float, $ulInUlPool: Float, $usdInUlPool: Float, $ungInUngPool: Float, $usdInUngPool: Float, $usoInUsoPool: Float, $usdInUsoPool: Float
  ){
    updateUser (
      user : {
        key: $key
        addresses : $addresses
        addressesMasternodes: $addressesMasternodes
        adressesMasternodesFreezer5: $adressesMasternodesFreezer5
        adressesMasternodesFreezer10: $adressesMasternodesFreezer10
        totalValue: $totalValue
        totalValueIncomeDfi: $totalValueIncomeDfi
        totalValueIncomeUsd: $totalValueIncomeUsd
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
          dfiInDfxStaking: $dfiInDfxStaking
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
          arkk: $arkk
          baba: $baba
          vnq: $vnq
          urth: $urth
          tlt: $tlt
          pdbc: $pdbc
          amzn: $amzn
          nvda: $nvda
          coin: $coin
          eem: $eem
          msft: $msft
          nflx: $nflx
          fb: $fb
          voo: $voo
          dis: $dis
          mchi: $mchi
          mstr: $mstr
          intc: $intc
          pypl: $pypl
          brkb: $brkb
          ko: $ko
          pg: $pg
          sap: $sap
          ura: $ura
          cs: $cs
          gsg: $gsg
          pplt: $pplt
          govt: $govt
          tan: $tan
          xom: $xom

          jnj : $jnj
          addyy : $addyy
          gs : $gs
          dax : $dax

          wmt : $wmt
          ul : $ul
          ung : $ung
          uso : $uso
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
          amznusd: $amznusd
          nvdausd: $nvdausd
          coinusd: $coinusd
          eemusd: $eemusd
          msftusd: $msftusd
          nflxusd: $nflxusd
          fbusd: $fbusd
          voousd: $voousd
          disusd: $disusd
          mchiusd: $mchiusd
          mstrusd: $mstrusd
          intcusd: $intcusd
          pyplusd: $pyplusd
          brkbusd: $brkbusd
          kousd: $kousd
          pgusd: $pgusd
          sapusd: $sapusd
          urausd: $urausd
          csusd: $csusd
          gsgusd: $gsgusd
          ppltusd: $ppltusd
          govtusd: $govtusd
          tanusd: $tanusd
          xomusd: $xomusd
          jnjusd  : $jnjusd
          addyyusd  : $addyyusd
          gsusd  : $gsusd
          daxusd  : $daxusd

          wmtusd  : $wmtusd
          ulusd  : $ulusd
          ungusd  : $ungusd
          usousd  : $usousd
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
          amznInAmznPool: $amznInAmznPool
          usdInAmznPool: $usdInAmznPool
          nvdaInNvdaPool: $nvdaInNvdaPool
          usdInNvdaPool: $usdInNvdaPool
          coinInCoinPool: $coinInCoinPool
          usdInCoinPool: $usdInCoinPool
          eemInEemPool: $eemInEemPool
          usdInEemPool: $usdInEemPool
          msftInMsftPool: $msftInMsftPool
          usdInMsftPool: $usdInMsftPool
          nflxInNflxPool: $nflxInNflxPool
          usdInNflxPool: $usdInNflxPool
          fbInFbPool: $fbInFbPool
          usdInFbPool: $usdInFbPool
          vooInVooPool: $vooInVooPool
          usdInVooPool: $usdInVooPool
          disInDisPool: $disInDisPool
          usdInDisPool: $usdInDisPool
          mchiInMchiPool: $mchiInMchiPool
          usdInMchiPool: $usdInMchiPool
          mstrInMstrPool: $mstrInMstrPool
          usdInMstrPool: $usdInMstrPool
          intcInIntcPool: $intcInIntcPool
          usdInIntcPool: $usdInIntcPool
          pyplInPyplPool: $pyplInPyplPool
          usdInPyplPool: $usdInPyplPool
          brkbInBrkbPool: $brkbInBrkbPool
          usdInBrkbPool: $usdInBrkbPool
          koInKoPool: $koInKoPool
          usdInKoPool: $usdInKoPool
          pgInPgPool: $pgInPgPool
          usdInPgPool: $usdInPgPool
          sapInSapPool: $sapInSapPool
          usdInSapPool: $usdInSapPool
          uraInUraPool: $uraInUraPool
          usdInUraPool: $usdInUraPool
          csInCsPool: $csInCsPool
          usdInCsPool: $usdInCsPool
          gsgInGsgPool: $gsgInGsgPool
          usdInGsgPool: $usdInGsgPool
          ppltInPpltPool: $ppltInPpltPool
          usdInPpltPool: $usdInPpltPool
          govtInGovtPool: $govtInGovtPool
          usdInGovtPool: $usdInGovtPool
          tanInTanPool: $tanInTanPool
          usdInTanPool: $usdInTanPool
          xomInXomPool: $xomInXomPool
          usdInXomPool: $usdInXomPool

           jnjInJnjPool : $jnjInJnjPool
          usdInJnjPool : $usdInJnjPool
          gsInGsPool : $gsInGsPool
          usdInGsPool : $usdInGsPool
          daxInDaxPool : $daxInDaxPool
          usdInDaxPool : $usdInDaxPool
          addyyInAddyyPool : $addyyInAddyyPool
          usdInAddyyPool : $usdInAddyyPool

          wmtInWmtPool : $wmtInWmtPool
          usdInWmtPool : $usdInWmtPool
          ulInUlPool : $ulInUlPool
          usdInUlPool : $usdInUlPool
          ungInUngPool : $ungInUngPool
          usdInUngPool : $usdInUngPool
          usoInUsoPool : $usoInUsoPool
          usdInUsoPool : $usdInUsoPool
        }
      }
    )
    {id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10,  wallet {
      dfi, dfiInStaking, dfiInDfxStaking, btc,eth, doge, usdt, usdc, usd, ltc, bch, tsla,
      qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc, amzn, nvda, coin, eem,
      msft, nflx, fb, voo, dis, mchi, mstr, intc,  pypl, brkb, ko, pg, sap, ura, cs, gsg, pplt, govt, tan, xom,
      jnj, addyy, gs, dax,  wmt, ul, ung, uso,
      spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
      amznusd,nvdausd,coinusd, eemusd,msftusd, nflxusd, fbusd, voousd, disusd, mchiusd, mstrusd, intcusd,
      pyplusd, brkbusd, kousd, pgusd, btcdfi , ethdfi, dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd,
      sapusd, urausd, csusd, gsgusd,  ppltusd, govtusd, tanusd, xomusd,
      jnjusd, addyyusd, gsusd, daxusd, wmtusd, ulusd, ungusd, usousd,
      btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool,
      dfiInUsdtPool,  dfiInUsdcPool,ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
      bchInBchPool, dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
      qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
      aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
      arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
      tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool,
      amznInAmznPool, usdInAmznPool,nvdaInNvdaPool,usdInNvdaPool,
      coinInCoinPool,usdInCoinPool,eemInEemPool, usdInEemPool,
      amznInAmznPool, usdInAmznPool,nvdaInNvdaPool,usdInNvdaPool,
      coinInCoinPool,usdInCoinPool,eemInEemPool, usdInEemPool,
      msftInMsftPool, usdInMsftPool,nflxInNflxPool,usdInNflxPool, fbInFbPool,usdInFbPool,vooInVooPool, usdInVooPool,
      disInDisPool, usdInDisPool, mchiInMchiPool, usdInMchiPool, mstrInMstrPool, usdInMstrPool, intcInIntcPool, usdInIntcPool,
      pyplInPyplPool, usdInPyplPool, brkbInBrkbPool, usdInBrkbPool, koInKoPool, usdInKoPool, pgInPgPool, usdInPgPool,
      sapInSapPool, usdInSapPool, uraInUraPool, usdInUraPool, csInCsPool, usdInCsPool, gsgInGsgPool, usdInGsgPool,
      ppltInPpltPool, usdInPpltPool, govtInGovtPool,  usdInGovtPool, tanInTanPool, usdInTanPool, xomInXomPool, usdInXomPool,
      jnjInJnjPool, usdInJnjPool, gsInGsPool, usdInGsPool, daxInDaxPool, usdInDaxPool, addyyInAddyyPool, usdInAddyyPool,
        wmtInWmtPool, usdInWmtPool, ulInUlPool, usdInUlPool, ungInUngPool, usdInUngPool, usoInUsoPool, usdInUsoPool
    }
    }
  }
`;

export const LOGIN = gql`
  query ($key: String) {
    userByKey(key: $key) {
      id, key, addresses, addressesMasternodes, adressesMasternodesFreezer5, adressesMasternodesFreezer10,
       newsletter {email, payingAddress, status, subscribed },
       wallet {
        dfi, dfiInStaking, dfiInDfxStaking, btc, eth, doge, usdt, usdc, usd, ltc, bch, tsla,
        qqq, spy, pltr, slv, aapl, gld, gme, googl, arkk, baba, vnq, urth, tlt, pdbc, amzn, nvda, coin, eem,
        msft, nflx, fb, voo, dis, mchi, mstr, intc, pypl, brkb, ko, pg, sap, ura, cs, gsg, pplt, govt, tan, xom,
        jnj, addyy, gs, dax,  wmt, ul, ung, uso,
        spyusd, qqqusd, pltrusd, slvusd, aaplusd, gldusd, gmeusd,googlusd,arkkusd, babausd,vnqusd,urthusd,tltusd, pdbcusd,
        amznusd,nvdausd,coinusd, eemusd, msftusd, nflxusd, fbusd, voousd, disusd, mchiusd, mstrusd, intcusd,
        pyplusd, brkbusd, kousd, pgusd, sapusd, urausd, csusd, gsgusd,
        btcdfi, ethdfi,dogedfi, ltcdfi, usdtdfi, usdcdfi, usddfi, bchdfi, tslausd, ppltusd, govtusd, tanusd, xomusd,
        jnjusd, addyyusd, gsusd, daxusd, wmtusd, ulusd, ungusd, usousd,
        btcInBtcPool, dfiInBtcPool,ethInEthPool,dfiInEthPool,usdtInUsdtPool,usdcInUsdcPool
        dfiInUsdtPool, dfiInUsdcPool, ltcInLtcPool,dfiInLtcPool,dogeInDogePool,dfiInDogePool,
        bchInBchPool,dfiInBchPool,usdInUsdPool, dfiInUsdPool, usdInTslaPool, tslaInTslaPool,
        qqqInQqqPool, usdInQqqPool, spyInSpyPool, usdInSpyPool, pltrInPltrPool, usdInPltrPool, slvInSlvPool, usdInSlvPool,
        aaplInAaplPool, usdInAaplPool, gldInGldPool, usdInGldPool, gmeInGmePool,usdInGmePool,googlInGooglPool, usdInGooglPool,
        arkkInArkkPool, usdInArkkPool,babaInBabaPool,usdInBabaPool,vnqInVnqPool, usdInVnqPool,urthInUrthPool,usdInUrthPool,
        tltInTltPool,usdInTltPool,pdbcInPdbcPool, usdInPdbcPool,
        amznInAmznPool, usdInAmznPool,nvdaInNvdaPool,usdInNvdaPool,
        coinInCoinPool,usdInCoinPool,eemInEemPool, usdInEemPool,
        msftInMsftPool, usdInMsftPool,nflxInNflxPool,usdInNflxPool,
        fbInFbPool,usdInFbPool,vooInVooPool, usdInVooPool,
        disInDisPool, usdInDisPool, mchiInMchiPool, usdInMchiPool, mstrInMstrPool, usdInMstrPool, intcInIntcPool, usdInIntcPool,
        pyplInPyplPool, usdInPyplPool, brkbInBrkbPool, usdInBrkbPool, koInKoPool, usdInKoPool, pgInPgPool, usdInPgPool,
        sapInSapPool, usdInSapPool, uraInUraPool, usdInUraPool, csInCsPool, usdInCsPool, gsgInGsgPool, usdInGsgPool,
        ppltInPpltPool, usdInPpltPool, govtInGovtPool,  usdInGovtPool, tanInTanPool, usdInTanPool, xomInXomPool, usdInXomPool,
        jnjInJnjPool, usdInJnjPool, gsInGsPool, usdInGsPool, daxInDaxPool, usdInDaxPool, addyyInAddyyPool, usdInAddyyPool,
        wmtInWmtPool, usdInWmtPool, ulInUlPool, usdInUlPool, ungInUngPool, usdInUngPool, usoInUsoPool, usdInUsoPool
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
  query ($fromYear: Int!, $fromMonth: Int!, $fromDay: Int!, $fromHour: Int!,
          $tillYear: Int!, $tillMonth: Int!, $tillDay: Int!, $tillHour: Int!){
      getFarmingHistory (
          from : {year: $fromYear, month: $fromMonth, day: $fromDay, hour: $fromHour, min: 0,s: 0},
          till : {year: $tillYear, month: $tillMonth, day: $tillDay, hour: $tillHour, min: 0,s: 0}) {

    date, pools {symbol, pair, priceA, priceB, reserveA, apr, volumeA, totalLiquidity, totalLiquidityLpToken, totalStaked, volume24h}
    }
  }
`;

export const EXCHANGE = gql`
  query GetStatisticsIncome {
  getExchangeStatus {
    bittrexStatus
    bittrexNotice
    kucoinStatusDeposit
    kucoinStatusWithdraw
    kucoinStatusDepositErc20
    kucoinStatusWithdrawErc20
    huobiStatus
  }
}
`;

export const CAKEYIELD = gql`
  query cakeYield {
  cakeYield {
    staking {
      apy
      id
    }
  }
}
`;


export const HISTORY_USER = gql`
  query ($key: String) {
  userHistoryByKey(key: $key) {
    key
    values {
      date
      totalValue
      totalValueIncomeDfi
      totalValueIncomeUsd
      _id
    }
  }
}
`;

export const HISTORY_ORACLE = gql`
  query ($token: String!, $date: Date) {
  getOracleHistory(token: $token, date: $date) {
    price
    dateTime
  }
}
`;

export const UPDATE_NEWSLETTER = gql`
  mutation ($key: String!, $email: String!, $payingAddress: String) {
  updateUserNewsletter(
    user: {
      key: $key
      email: $email
      payingAddress: $payingAddress
    }) {
    newsletter {
      status, subscribed, email, payingAddress
    }
  }
}
`;

export const DELETE_HISTORY = gql`
mutation DeleteUserHistory($key: String!, $items: [String]) {
  deleteUserHistory(user : { key: $key, items: $items}) {
   key
  }
}
`;



