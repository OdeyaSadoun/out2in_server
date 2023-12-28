import numpy as np
import csv
import networkx as nx


# import matplotlib.pyplot as plt


def out_degree(g, node):
    return len(list(g.neighbors(node)))

# print(list(g.neighbors('E')))
def in_degree2(g, node):
    edges = list(g.edges)
    return sum([1 for edge in edges if edge[1] == node])


def statistic(vertex, g):
    # 1:
    # global g
    din = in_degree2(g, vertex)  # n-1
    din = din / 5 * 100

    # 2:
    dout = out_degree(g, vertex)
    dout = dout / 3 * 100

    # 3:
    # degree = din + dout
    pre = g.predecessors(vertex)  # din
    suc = g.successors(vertex)  # dout
    count = 0
    for item in suc:
        if item in pre:
            count = count + 1
    # print(vertex,count)
    count = 1 / 3 * count * 100
    final = round(1 / 3 * din + 1 / 3 * dout + 1 / 3 * count, 1)
    # ...
    return final


def scanGraph(g):
    d = {}
    for node in list(g):
        d[node] = (in_degree2(g, node), out_degree(g, node))
        # print(node, in_degree2(g,node),out_degree(g,node))
    return d


g = nx.DiGraph()


def main(my_list=None):
    if my_list is None:
        with open('yyy.csv', newline='') as f:
            reader = csv.reader(f)
            my_list = [tuple(row) for row in reader]
    #print(my_list)
    my_array = np.array(my_list)
    # printing my_array
    # print (my_array)
    # printing the type of my_array
    for x in my_array:
        g.add_edge(x[1], x[2])
        g.add_edge(x[1], x[3])
        g.add_edge(x[1], x[4])
    # print("Direction graph:")
    nx.draw(g, with_labels=True)
    # plt.draw()
    # plt.show()

    d = {}
    for node in list(g):
        # print(out_degree(g,node))
        d[node] = (in_degree2(g, node), out_degree(g, node))
    # scan_array = [d]

    dnew = {}
    for key in d:
        # print (key, 'corresponds to', d[key])
        # for item in scan_array.:
        #  print(key)
        mark = statistic(key, g)
        # dd(mark)
        for node in list(g):
            if node == key:
                dnew[node] = mark
        # d[key.index][3] = mark
    # print("The index of analyzed data presented to the teacher:")
    # print(dnew)
    return dnew


if __name__ == '__main__':
    main()
