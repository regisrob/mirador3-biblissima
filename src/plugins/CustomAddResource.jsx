import React from 'react';
import PropTypes from 'prop-types';
import WorkspaceAdd from 'mirador/dist/cjs/src/containers/WorkspaceAdd';

const CustomAddResource = (props) => {
    const {
        showAddResource
    } = props;

    return (
        showAddResource && <WorkspaceAdd/>
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
