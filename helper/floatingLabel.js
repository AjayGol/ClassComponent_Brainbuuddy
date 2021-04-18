import React, {Component} from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Constant from './constant';
import {
    StyleSheet,
    TextInput,
    LayoutAnimation,
    Animated,
    Easing,
    Text,
    View,
    ViewPropTypes,
    InteractionManager
} from 'react-native';

var textPropTypes = Text.propTypes || ViewPropTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
    ...textInputPropTypes,
    inputStyle: textInputPropTypes.style,
    labelStyle: textPropTypes.style,
    disabled: PropTypes.bool,
    style: ViewPropTypes.style,
}

var cleanStyle = {
    fontSize: 15,
    top: 12
}

var dirtyStyle = {
    fontSize: 12,
    top: Constant.isIOS && -12 || -10,
}


var FloatingLabel  = createReactClass({
    propTypes: propTypes,

    getInitialState () {
        this.dirty = (this.props.value || this.props.placeholder)
        var style = this.dirty ? dirtyStyle : cleanStyle;
        var state = {
            text: this.props.value,
            top: new Animated.Value(style.top),
            fontSize: new Animated.Value(style.fontSize),
        };
        return state;
    },

    UNSAFE_componentWillReceiveProps(props) {
        if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
            this.setState({ text: props.value})
            this.dirty = !!props.value;
            this._animate(!!props.value);
        }
    },

    _animate(dirty) {
        var nextStyle = dirty ? dirtyStyle : cleanStyle
        Animated.parallel([
            Animated.timing(
                this.state.fontSize,
                {
                    toValue: nextStyle['fontSize'],
                    duration: 200,
                },
                Easing.ease
            ),
            Animated.timing(
                this.state.top,
                {
                    toValue: nextStyle['top'],
                    duration: 200,
                    useNativeDriver: true
                },
                Easing.ease
            )]).start();
    },

    _onFocus () {
        this._animate(true)
        this.dirty = true;
        if (this.props.onFocus) {
            this.props.onFocus(arguments);
        }
    },

    _onBlur () {
        if (!this.state.text) {
            this._animate(false)
            this.dirty = false;
        }
        if (this.props.onBlur) {
            this.props.onBlur(arguments);
        }
    },

    onChangeText(text) {
        this.setState({ text })
        if (this.props.onChangeText) {
            this.props.onChangeText(text)
        }
    },

    updateText(event) {
        var text = event.nativeEvent.text
        this.setState({text})

        if (this.props.onEndEditing) {
            this.props.onEndEditing(event)
        }
    },

    _renderLabel () {
        return (
            <Animated.View style={[styles.label,{transform: [{translateY: this.state.top}]}]}>
                <Animated.Text
                    ref='label'
                    style={[this.props.labelStyle,{fontSize: this.state.fontSize}]}>
                    {this.props.children}
                </Animated.Text>
            </Animated.View>
        )
    },

    render() {
        var props = {
                autoCapitalize: this.props.autoCapitalize,
                autoCorrect: this.props.autoCorrect,
                autoFocus: this.props.autoFocus,
                bufferDelay: this.props.bufferDelay,
                clearButtonMode: this.props.clearButtonMode,
                clearTextOnFocus: this.props.clearTextOnFocus,
                controlled: this.props.controlled,
                editable: this.props.editable,
                enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
                keyboardType: this.props.keyboardType,
                multiline: this.props.multiline,
                numberOfLines: this.props.numberOfLines,
                onBlur: this._onBlur,
                onChange: this.props.onChange,
                onChangeText: this.onChangeText,
                onEndEditing: this.updateText,
                onFocus: this._onFocus,
                onSubmitEditing: this.props.onSubmitEditing,
                password: this.props.secureTextEntry || this.props.password,
                placeholder: this.props.placeholder,
                secureTextEntry: this.props.secureTextEntry || false,
                returnKeyType: this.props.returnKeyType,
                selectTextOnFocus: this.props.selectTextOnFocus,
                selectionState: this.props.selectionState,
                style: [styles.input],
                testID: this.props.testID,
                value: this.state.text,
                maxLength: this.props.maxLength
            },
            elementStyles = [styles.element];

        if (this.props.inputStyle) {
            props.style.push(this.props.inputStyle);
        }

        if (this.props.style) {
            elementStyles.push(this.props.style);
        }

        return (
            <View style={elementStyles}>
                {this._renderLabel()}
                <TextInput
                    {...props}
                    ref={this.props.refName}>
                </TextInput>
            </View>
        );
    },
});

var labelStyleObj = {
    paddingLeft: 9,
    position: 'absolute'
}

var styles = StyleSheet.create({
    element: {
        position: 'relative'
    },
    input: {
        height: 40,
        backgroundColor: 'transparent',
        paddingLeft: 10,
    },
    label: labelStyleObj
})

module.exports = FloatingLabel;
