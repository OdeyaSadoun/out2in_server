from matplotlib import pyplot as plt
import networkx as nx

friends_list = [{"student": 1, "friends": [2,3,4]},{"student": 2, "friends": [5,3,4]},{"student": 5, "friends": [2,3,4]},{"student": 4, "friends": [2,5,1]}]

def make_directed_graph_for_connections_between_students(friends_list):
    g = nx.DiGraph()

    # הוספת הצמתים לגרף
    #maybe not neccery
    for student in friends_list:
        g.add_node(student["student"])

    # הוספת הקשתות לגרף
    for student in friends_list:
        for friend in student["friends"]:
            g.add_edge(student["student"], friend)

    # הדפסת הגרף בתצוגה ויזואלית
    nx.draw(g, with_labels=True)
    plt.show()


def out_degree(g, node):
    return len(list(g.neighbors(node)))


def in_degree(g, node):
    edges = list(g.edges)
    return sum([1 for edge in edges if edge[1] == node])


def statistic(vertex, g):
    # 1:
    # global g
    din = in_degree(g, vertex)  # n-1
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
        d[node] = (in_degree(g, node), out_degree(g, node))
        # print(node, in_degree2(g,node),out_degree(g,node))
    return d

