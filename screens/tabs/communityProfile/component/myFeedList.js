import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView, Animated, RefreshControl, FlatList, ActivityIndicator, Text, TouchableOpacity
} from 'react-native';
import Constant from '../../../../helper/constant';
import {connect} from 'react-redux';
import _ from 'lodash';
import {ThemeContext} from 'AppTheme';
import moment from "moment";
import FeedList from "../../team/component/new/feedListing";
import {showThemeAlert} from "../../../../helper/appHelper";
import {ActionSheetCustom as ActionSheet} from "react-native-actionsheet";
import {strLocale} from "locale";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyFeedList extends React.PureComponent {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            dismiss: false,
            // feed: props.list ? (props.list.length !== 0 ? props.list : []) : [],
            isLoading: false,
            feed: props.feedList || [],
            isShowAlert: false,
            isShowThanksAlert: false,
            actionSheet: [strLocale("community.Delete"), strLocale("comman.Cancel")],
            action: {},
        };
    }

    UNSAFE_componentWillMount() {

    }

    componentWillReceiveProps(props) {
        if (this.props.feedList !== props.feedList) {
            let arr = props.feedList.sort((a, b) => {
                return b.created_at - a.created_at
            })

            this.setState({
                feed: arr
            })
        }
    }

    onComment = (item, index) => {
        this.props.navigation.navigate('commentCommunity', {
            detail: item,
            index: 0,
            feedId: item.id,
            type: item.typeCategory,
        })
    };

    hideAlert = () => {
        const {action, feed, actionIndex, filter} = this.state
        const {userDetails} = this.props

        this.setState(
            {isShowAlert: false},
            () => {
                this.props.onInApproriate(action)
            })
    }


    onInAppropriate = () => {
        setTimeout(() => {
            showThemeAlert({
                title: strLocale("community.Are you sure you want to report this user"),
                leftBtn: strLocale("community.Confirm"),
                leftPress: () => {
                    this.hideAlert()
                },
                rightBtn: strLocale("community.Cancel"),
                rightPress: (i) => {
                    this.setState({isShowAlert: false})
                }
            });
        }, 500)
    };

    onThanksAlert = () => {
        setTimeout(() => {
            showThemeAlert({
                title: strLocale("community.Success"),
                message: strLocale("community.A complaint successfully been sent"),
                leftBtn: strLocale("community.Ok"),
                leftPress: () => {
                    this.setState({isShowThanksAlert: false})
                }
            });
        }, 500)
    };

    onMore = (feed, index) => {
        const {userDetails} = this.props

        if (userDetails.id === feed.user_id) {
            this.setState({
                actionSheet: [strLocale("community.Delete"),  strLocale("comman.Cancel")],
                action: feed,
                actionIndex: index
            }, () => {
                this.ActionSheet.show()
            })
        } else {
            this.setState({
                actionSheet: [strLocale("community.Flag as inappropriate"), strLocale("comman.Cancel")],
                action: feed,
                actionIndex: index
            }, () => {
                this.ActionSheet.show()
            })
        }

    }

    refreshData = () => {
        this.setState({
            page: 1,
            loadMore: true,
        }, () => {
            // const {page} = this.state
            // this.apiCalling(page)
        })
    }

    renderFooter = () => {
        let appColor = Constant[this.context];

        const {isLoading} = this.state
        if (this.state.feed.length === 0 && this.props.isLoading === true) {
            return (
                <ActivityIndicator
                    style={{color: Constant.newTabSelected, marginTop: 20}}
                />
            )
        }
        if (this.state.feed.length === 0 && this.props.isLoading === false) {
            return (
                <Text style={{
                    width: '100%', alignSelf: 'center',
                    marginTop: 50, textAlign: 'center',
                    fontSize: 15,
                    fontFamily: Constant.font500,
                    color: appColor.titleMain
                    }}>
                    {`${this.props.userName} not posted any feed`}
                </Text>
            )
        }

        if (!this.state.isLoading) {
            return (
                <View style={{width: '100%', height: 50}}/>
            )
        }
    };

    renderItem = ({item, index}) => {

        const {time} = item
        const {userDetails} = this.props

        var isPitcure = false
        var isVideo = false
        var mediaObj = {}

        var isLike = false
        var likeString = ''
        if (item.likes) {

            const likeIds = Object.keys(item.likes)
            if (likeIds.length > 0 && likeIds !== null) {
                isLike = likeIds.indexOf(userDetails.id) !== -1
                likeString = 'Liked by '

                var likeName = ''
                if (isLike) {
                    likeName = 'You'
                } else {
                    if (item.likes_by_user) {
                        const likesByUserIds = Object.keys(item.likes_by_user)
                        if (likeIds.length === likesByUserIds.length) {
                            likeName = item.likes_by_user[likesByUserIds[likesByUserIds.length - 1]]
                        }
                    }
                }

                if (likeName !== '') {
                    likeString += likeName
                    if (likeIds.length > 1) {
                        likeString += ` and ${likeIds.length - 1} others`
                    }
                } else {
                    likeString += `${likeIds.length}`
                }
            }
        }

        var likeArray = []
        if (item.comments !== undefined) {
            likeArray = Object.keys(item.comments)
        }

        return (
            <FeedList
                item={item}
                key={index}
                userDetails={userDetails}
                navigation={this.props.navigation}
                index={index}
                time={time}
                Photo={isPitcure}
                isVideo={isVideo}
                mediaObj={mediaObj}
                pictureWidth={0}
                pictureHeight={0}
                videoWidth={0}
                videoHeight={0}
                isLike={isLike}
                likeString={likeString}
                likeArray={likeArray}
                onLike={this.onLike}
                onComment={this.onComment}
                playerRef={this.playerRef}
                onMore={this.onMore}
                onProfile={() => {
                }}
                isHideBottom={true}
                typeCategory={item.typeCategory || ''}
            />
        )
    }

    render() {
        let appColor = Constant[this.context];
        const {feed, isShowAlert, isShowThanksAlert, actionSheet, action} = this.state

        return (
            <View style={[styles.mainContainer, {backgroundColor: appColor.scrollableViewBack, marginHorizontal: 5}]}>

                <AnimatedFlatList
                    ref={(r) => {
                        this.flatlist = r
                    }}
                    data={(feed && typeof (feed.length) !== 'undefined') && feed || []}
                    renderItem={this.renderItem}
                    // ListHeaderComponent={this.renderHeaderItem}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    scrollEventThrottle={1}
                    // onScroll={
                    //     Animated.event(
                    //         [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                    //         {useNativeDriver: true},
                    //     )
                    // }
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => this.refreshData()}
                            tintColor={'#3AD29F'}
                            titleColor={'#3AD29F'}
                        />
                    }
                    // onEndReached={() => this.paginationManager()}
                    onEndReachedThreshold={0}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={(feed && typeof (feed.length) !== 'undefined') && feed || []}
                    // onViewableItemsChanged={this.onViewableItemsChanged}
                    // viewabilityConfig={this.viewabilityConfig}
                    // initialNumToRender={5}
                    keyboardDismissMode={'on-drag'}
                />
                {/*<ScrollView style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>*/}

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={actionSheet}
                    // themeBackground={appColor.popupModalBackground}
                    // themeBackground2={appColor.popupModalBackground2}
                    // tintColor={appColor.actionSheetText}
                    cancelButtonIndex={1}
                    data={{actionSheet}}
                    onPress={(index) => {
                        if (index === 0 && actionSheet.length > 0 && actionSheet[0] === strLocale("community.Delete")) {
                            this.props.onDeleteFeed(action)
                        } else if (index === 0 && actionSheet.length > 0 && actionSheet[0] === strLocale("community.Flag as inappropriate")) {
                            this.setState({
                                isShowAlert: true
                            })
                        }
                    }}
                />

                {
                    isShowAlert &&
                    this.onInAppropriate()
                }

                {
                    isShowThanksAlert &&
                    this.onThanksAlert()
                }

                {/*</ScrollView>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
});

const mapStateToProps = state => {
    return {
        list: state.helpPost.list,
        total_p_clean_days: state.statistic.pornDetail.total_p_clean_days,
        improvementPercentage: state.metaData.improvementPercentage,
        rewiringProgress: state.metaData.rewiringProgress,
        clean_p_days_per_month: state.statistic.pornDetail.clean_p_days_per_month,
        p_array: state.statistic.pornDetail.p_array,
        visibleTab: state.user.visibleTab,
        userDetails: state.user.userDetails,
    };
};

export default connect(mapStateToProps, {})(MyFeedList);
