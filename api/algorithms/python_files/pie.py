import matplotlib.pyplot as plt
# Pie chart, where the slices will be ordered and plotted counter-clockwise:

def main(labels,sizes):
    fig1, ax1 = plt.subplots()
    ax1.pie(sizes, labels=labels, autopct='%1.1f%%',
            shadow=True, startangle=90)
    ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
    #
    centre_circle = plt.Circle((0, 0), 0.70, fc='white')
    plt.gcf().gca().add_artist(centre_circle)
    #
    plt.show()
