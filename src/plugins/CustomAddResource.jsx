import React from 'react';
import PropTypes from 'prop-types';
import WorkspaceAdd from 'mirador/dist/cjs/src/containers/WorkspaceAdd';

const CustomAddResource = (props) => {
    const {
        showAddResource, classes
    } = props;

    classes.fab = !showAddResource && classes.displayNone
    return (
        <WorkspaceAdd classes={classes}/>
    );
}

const mapStateToProps = (state, { windowId }) => {
    return {
        showAddResource: state.config.CustomAddResource.showAddResource
    }
};

CustomAddResource.propTypes = {
    showAddResource: PropTypes.bool
};

CustomAddResource.defaultProps = {
    showAddResource: false
};

export default {
    target: 'WorkspaceAdd',
    mode: "wrap",
    component: CustomAddResource,
    mapStateToProps
};
