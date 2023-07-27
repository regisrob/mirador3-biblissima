import React from "react";
import { connect } from 'react-redux';
import MiradorMenuButton from 'mirador/dist/cjs/src/containers/MiradorMenuButton';
import * as actions from 'mirador/dist/cjs/src/state/actions';
import { getWindowViewType } from 'mirador/dist/cjs/src/state/selectors';
import GalleryViewIcon from 'mirador/dist/cjs/src/components/icons/GalleryViewIcon';

const mapStateToProps = (state, { windowId }) => (
    {
        windowViewType: getWindowViewType(state, { windowId }),
    }
);

const mapDispatchToProps = { setWindowViewType: actions.setWindowViewType };

const _CustomGalleryButton = (props) => {
    const {TargetComponent, windowViewType, setWindowViewType, ...targetComponentProps} = props

    return (
        <>
            <MiradorMenuButton
                key="gallery"
                onClick={() => { setWindowViewType(props.windowId, "gallery");}}
                aria-label={props.t('gallery')}
            >
                <GalleryViewIcon color={windowViewType === "gallery" ? 'secondary' : undefined}/>
            </MiradorMenuButton>
            <TargetComponent {...targetComponentProps}></TargetComponent>
        </>
    )
}

const CustomGalleryButton = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(_CustomGalleryButton)

export default {
    target: 'WindowTopMenuButton',
    mode: "wrap",
    component: CustomGalleryButton
  };
