import EventService from "../../services/EventService";

export const namespaced = true

export const state = {

    eventsTotal: 0,
    events: [],
    event: {}
}

export const mutations = {
    ADD_EVENT(state, event) {
        state.events.push(event)
    },
    SET_EVENTS(state, events){
        state.events = events
    },
    SET_EVENTS_TOTAL(state, eventsTotal){
        state.eventsTotal = eventsTotal
    },
    SET_EVENT(state, event){
        state.event = event
    }
}

export const actions = {
    fetchEvents({ commit }, { perPage, page }) {
        EventService.getEvents(perPage, page)
            .then(response => {
                commit('SET_EVENTS_TOTAL', parseInt(response.headers['x-total-count']))
                //console.log('Total events are ' + response.headers['x-total-count'])
                commit("SET_EVENTS", response.data)
            })
            .catch(error => {
                console.log('There was an error:', error.response)
            })
    },
    createEvent({ commit }, event){
        return EventService.postEvent(event).then(() => {
            commit('ADD_EVENT', event)
        })
    },
    fetchEvent( { commit, getters }, id){
        var event = getters.getEventById(id)

        if (event) {
            commit("SET_EVENT", event)
        }
        else{
            EventService.getEvent(id)
                .then(response => {
                    commit( "SET_EVENT", response.data)
                })
                .catch(error => {
                    console.log('There was an error:', error.response)
                })
        }
    }
}

export const getters = {
    getEventById: state => id => {
        return state.events.find(event => event.id === id)
    }
}