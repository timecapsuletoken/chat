import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as BlackLogoSvg } from '../../assets/images/logos/BlackTCALogoBETA.svg';
import { ReactComponent as WhiteLogoSvg } from '../../assets/images/logos/WhiteTCALogoBETA.svg';
import { useColorScheme } from '@mui/material/styles';

export default function SitemarkIcon() {
  const { mode, systemMode } = useColorScheme();

  // Determine the resolved mode
  const resolvedMode = mode === 'system' ? systemMode : mode || 'dark';

  // Select the appropriate logo based on the resolved mode
  const LogoSvg = resolvedMode === 'dark' ? WhiteLogoSvg : BlackLogoSvg;

  return (
    <SvgIcon
      sx={{ height: 21, width: 100, mr: 2 }}
      component={LogoSvg}
      inheritViewBox
    />
  );
}
