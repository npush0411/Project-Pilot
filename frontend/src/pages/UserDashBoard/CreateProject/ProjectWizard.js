import React, { useState, useEffect } from 'react';
import Topbar from '../Topbar';
import Form from './Form';
const ProjectWizard = () => {
    return (
        <div>
            <Topbar title="Project Wizard"/>
            <Form/>
        </div>
    )
};

export default ProjectWizard;