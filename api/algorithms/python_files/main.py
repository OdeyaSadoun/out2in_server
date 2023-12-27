import pprint
import os

import tkinter as tk
import PySimpleGUI as sg

import pandas as pd

import main_core


def popup_friends(name, f1, f2, f3):
    popup = [
        [sg.T('name')],
        [sg.In(name, key='-name-')],
        [sg.T('friend 1')],
        [sg.In(f1, key='-friend-1-')],
        [sg.T('friend 2')],
        [sg.In(f2, key='-friend-2-')],
        [sg.T('friend 3')],
        [sg.In(f3, key='-friend-3-')],
        [sg.Ok(key='ok')]
    ]
    window = sg.Window('popup', popup)
    e, v = window.read(close=True)
    return v['-name-'], v['-friend-1-'], v['-friend-2-'], v['-friend-3-']


#
data = []
PASSWORD = '*****'
sg.theme('DarkAmber')  # Add a touch of color
# All the stuff inside your window.
layout = [[sg.Text('how do you want to log in ?')],
          [sg.Button('Teacher'), sg.Button('Student')]]

# Create the Window
window = sg.Window('Out2In', layout)
# Event Loop to process "events" and get the "values" of the inputs
while True:
    event, values = window.read()
    if event == sg.WIN_CLOSED:  # if user closes window
        break

    elif event == 'Teacher':
        if sg.popup_get_text('password') == PASSWORD:
            window.close()
            a = main_core.main(pd.read_csv('yyy.csv').values.tolist())
            print(a)
            if sg.popup_yes_no('show pie ?') == 'Yes':
                import pie

                pie.main(list(a.keys()), list(a.values()))
            else:
                dn = {k: v for k, v in a.items() if v <= 30}
                s = pprint.pformat(list(dn.keys()))
                sg.popup(s)
        else:
            sg.popup('not the password')
        ###

    elif event == 'Student':
        window.close()
        data.append(popup_friends('name', 'friend1', 'friend2', 'friend3'))
        #if not os.path.exists('yyy.csv'):
        #    with open('yyy.csv', 'w') as csvfile:
        #print('NEW ONE')
        pd.DataFrame(data).to_csv('yyy.csv',mode='a', header=False, index_label=False)
        sg.popup('well done')

window.close()
