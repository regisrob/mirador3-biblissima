import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function ({ TargetComponent, targetProps, className }) {

  return <div className={className}>
    <Typography align="center">
      <IconButton
        component="a"
        href="https://portail.biblissima.fr"
        target="_blank"
        rel="noopener"
      >
        <SvgIcon viewBox="0 0 199.000000 257.000000" aria-label="Biblissima" fontSize="large">
          <g transform="translate(0.000000,257.000000) scale(0.100000,-0.100000)" fill="rgb(0,0,51)" stroke="rgb(0,0,51)" stroke-width="0px">
           <path d="M410 1290 l0 -1170 235 0 235 0 0 1170 0 1170 -235 0 -235 0 0 -1170z" />
           <path d="M1110 820 l0 -700 235 0 235 0 0 700 0 700 -235 0 -235 0 0 -700z"/>
          </g>
        </SvgIcon>
      </IconButton>
    </Typography>
  </div>;
}
