import React from 'react';
                        import {FuseExample, FuseHighlight, FusePageSimple} from '@fuse';
                        import {Button, Icon, Typography} from 'material-ui';
                        import {withStyles} from 'material-ui/styles/index';
                        /* eslint import/no-webpack-loader-syntax: off */
                        const styles = theme => ({
                            layoutRoot: {}
                        });
                        function Lists({classes}) {
                          return (
                            
         <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <Typography variant="title">Lists</Typography>
                    <Button className="normal-case"
                            variant="raised" component="a" href="https://material-ui-next.com/demos/lists" target="_blank">
                        <Icon className="mr-4">link</Icon>
                        Reference
                    </Button>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl mx-auto">
                     <Typography className="text-44 mt-32 mb-8" component="h1">Lists</Typography><Typography className="mb-16" component="p"><a href="https://material.io/guidelines/components/lists.html">Lists</a> present multiple line items vertically as a single continuous element.</Typography><Typography className="mb-16" component="p">Lists are made up of a continuous column of rows. Each row contains a tile. Primary actions fill the tile, and supplemental actions are represented by icons and text.</Typography><Typography className="mb-16" component="p">Lists are best suited for similar data types.</Typography><Typography className="text-24 mt-32 mb-8" component="h3">Simple List</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/SimpleList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/SimpleList.js')}/>

<Typography className="text-24 mt-32 mb-8" component="h3">Folder List</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/FolderList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/FolderList.js')}/>

<Typography className="text-24 mt-32 mb-8" component="h3">Inset List</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/InsetList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/InsetList.js')}/>

<Typography className="text-24 mt-32 mb-8" component="h3">Nested List</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/NestedList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/NestedList.js')}/>

<Typography className="text-24 mt-32 mb-8" component="h3">Pinned Subheader List</Typography><Typography className="mb-16" component="p">Upon scrolling, subheaders remain pinned to the top of the screen until pushed off screen by the next subheader.</Typography><Typography className="mb-16" component="p">This feature is relying on the CSS sticky positioning.
Unfortunately it&#39;s <a href="https://caniuse.com/#search=sticky">not implemented</a> by all the browsers we are supporting. We default to <code>disableSticky</code> when not supported.</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/PinnedSubheaderList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/PinnedSubheaderList.js')}/>

<Typography className="text-32 mt-32 mb-8" component="h2">List Controls</Typography><Typography className="text-24 mt-32 mb-8" component="h3">Checkbox</Typography><Typography className="mb-16" component="p">A checkbox can either be a primary action or a secondary action.</Typography><Typography className="mb-16" component="p">The checkbox is the primary action and the state indicator for the list item. The comment button is a secondary action and a separate target.</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/CheckboxList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/CheckboxList.js')}/>

<Typography className="mb-16" component="p">The checkbox is the secondary action for the list item and a separate target.</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/CheckboxListSecondary.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/CheckboxListSecondary.js')}/>

<Typography className="text-24 mt-32 mb-8" component="h3">Switch</Typography><Typography className="mb-16" component="p">The switch is the secondary action and a separate target.</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/SwitchListSecondary.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/SwitchListSecondary.js')}/>

<Typography className="text-32 mt-32 mb-8" component="h2">Interactive</Typography><Typography className="mb-16" component="p">Below is an interactive demo that lets you explore the visual results of the different settings:</Typography><FuseExample
                    className="my-24"
                    component={require('main/content/components/material-ui/material-ui-examples/lists/InteractiveList.js').default} 
                    raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/lists/InteractiveList.js')}/>
                </div>
            }
        />
    
                          );
                        }
                        
                        export default withStyles(styles, {withTheme: true})(Lists);
                        