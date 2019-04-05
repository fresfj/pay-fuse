import React, {useEffect} from 'react';
import {TextField, Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, FormControlLabel, Switch} from '@material-ui/core';
import FuseUtils from '@fuse/FuseUtils';
import {useForm} from '@fuse/hooks';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from '@lodash';
import moment from 'moment';
import * as Actions from './store/actions';

const defaultFormState = {
    id    : FuseUtils.generateGUID(),
    title : '',
    allDay: true,
    start : new Date(),
    end   : new Date(),
    desc  : ''
};

function EventDialog(props)
{
    const {form, handleChange, setForm} = useForm(defaultFormState);
    let start = moment(form.start).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
    let end = moment(form.end).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if ( props.eventDialog.props.open )
        {
            /**
             * Dialog type: 'edit'
             * Update State
             */
            if ( props.eventDialog.type === 'edit' &&
                props.eventDialog.data &&
                !_.isEqual(props.eventDialog.data, form) )
            {
                setForm({...props.eventDialog.data});
            }

            /**
             * Dialog type: 'new'
             * Update State
             */
            if ( props.eventDialog.type === 'new' )
            {
                setForm({
                    ...defaultFormState,
                    ...props.eventDialog.data,
                    id: FuseUtils.generateGUID()
                });
            }
        }
    }, [props.eventDialog.props.open]);

    function closeComposeDialog()
    {
        props.eventDialog.type === 'edit' ? props.closeEditEventDialog() : props.closeNewEventDialog();
    }

    function canBeSubmitted()
    {
        return (
            form.title.length > 0
        );
    }

    function handleSubmit(event)
    {
        event.preventDefault();

        if ( props.eventDialog.type === 'new' )
        {
            props.addEvent(form);
        }
        else
        {
            props.updateEvent(form);
        }
        closeComposeDialog();
    }

    function handleRemove()
    {
        props.removeEvent(form.id);
        closeComposeDialog();
    }

    return (
        <Dialog {...props.eventDialog.props} onClose={closeComposeDialog} fullWidth maxWidth="xs" component="form">

            <AppBar position="static">
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {props.eventDialog.type === 'new' ? 'New Event' : 'Edit Event'}
                    </Typography>
                </Toolbar>
            </AppBar>

            <form noValidate onSubmit={handleSubmit}>
                <DialogContent classes={{root: "p-16 pb-0 sm:p-24 sm:pb-0"}}>
                    <TextField
                        id="title"
                        label="Title"
                        className="mt-8 mb-16"
                        InputLabelProps={{
                            shrink: true
                        }}
                        inputProps={{
                            max: end
                        }}
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        variant="outlined"
                        autoFocus
                        required
                        fullWidth
                    />

                    <FormControlLabel
                        className="mt-8 mb-16"
                        label="All Day"
                        control={
                            <Switch
                                checked={form.allDay}
                                id="allDay"
                                name="allDay"
                                onChange={handleChange}
                            />
                        }/>

                    <TextField
                        id="start"
                        name="start"
                        label="Start"
                        type="datetime-local"
                        className="mt-8 mb-16"
                        InputLabelProps={{
                            shrink: true
                        }}
                        inputProps={{
                            max: end
                        }}
                        value={start}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />

                    <TextField
                        id="end"
                        name="end"
                        label="End"
                        type="datetime-local"
                        className="mt-8 mb-16"
                        InputLabelProps={{
                            shrink: true
                        }}
                        inputProps={{
                            min: start
                        }}
                        value={end}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />

                    <TextField
                        className="mt-8 mb-16"
                        id="desc" label="Description"
                        type="text"
                        name="desc"
                        value={form.desc}
                        onChange={handleChange}
                        multiline rows={5}
                        variant="outlined"
                        fullWidth
                    />
                </DialogContent>

                {props.eventDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-8 sm:pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!canBeSubmitted()}
                        >
                            Add
                        </Button>
                    </DialogActions>
                ) : (
                    <DialogActions className="justify-between pl-8 sm:pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!canBeSubmitted()}
                        > Save
                        </Button>
                        <IconButton onClick={handleRemove}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </DialogActions>
                )}
            </form>
        </Dialog>
    );
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        closeEditEventDialog: Actions.closeEditEventDialog,
        closeNewEventDialog : Actions.closeNewEventDialog,
        addEvent            : Actions.addEvent,
        updateEvent         : Actions.updateEvent,
        removeEvent         : Actions.removeEvent
    }, dispatch);
}

function mapStateToProps({calendarApp})
{
    return {
        eventDialog: calendarApp.events.eventDialog
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDialog);