import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import classNames from 'classnames';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MiradorMenuButton from 'mirador/dist/cjs/src/containers/MiradorMenuButton';
import WorkspaceOptionsMenu from 'mirador/dist/cjs/src/containers/WorkspaceOptionsMenu';
import WorkspaceOptionsButton from 'mirador/dist/cjs/src/containers/WorkspaceOptionsButton';

export default function ({ TargetComponent, targetProps, t, classes, anchorEl }) {

  return (
      <>
        <MiradorMenuButton
          aria-label={t('workspaceOptions')}
          className={
            classNames(classes.ctrlBtn, (anchorEl ? classes.ctrlBtnSelected : null))
          }
          onClick={targetProps.handleMenuClick}
          //onClick={() => { handleMenuClick }}
        >
          <ImportExportIcon />
        </MiradorMenuButton>

        <WorkspaceOptionsMenu
          anchorEl={anchorEl}
          handleClose={targetProps.handleMenuClose}
        />
      </>
  );
}
