with open("advent13_input.txt", "r") as f:
    input = f.read()

# Rename this to just "input" to run with test input
input_test = """
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
"""

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point(x={self.x}, y={self.y})"

    def __repr__(self):
        return str(self)

class Machine:

    COST_A = 3
    COST_B = 1

    def __str__(self):
        return f"Machine(a={self.a}, b={self.b}, prize={self.prize})"

    def __repr__(self):
        return str(self)

    def prize_cost_eq(self):
        """
        Solve the equation:
        self.a.x * presses_a + self.b.x * presses_b = self.prize.x
        self.a.y * presses_a + self.b.y * presses_b = self.prize.y

        self.a.x * presses_a = self.prize.x - self.b.x * presses_b
        self.a.y * presses_a = self.prize.y - self.b.y * presses_b

        presses_a = (self.prize.x - self.b.x * presses_b) / self.a.x
        presses_a = (self.prize.y - self.b.y * presses_b) / self.a.y
        
        (self.prize.x - self.b.x * presses_b) / self.a.x = (self.prize.y - self.b.y * presses_b) / self.a.y
        self.a.y * self.prize.x - self.a.y * self.b.x * presses_b = self.a.x * self.prize.y - self.a.x * self.b.y * presses_b

        self.a.x * self.b.y * presses_b - self.a.y * self.b.x * presses_b = self.a.x * self.prize.y - self.a.y * self.prize.x
        presses_b * (self.a.x * self.b.y - self.a.y * self.b.x) = self.a.x * self.prize.y - self.a.y * self.prize.x
        presses_b = (self.a.x * self.prize.y - self.a.y * self.prize.x) / (self.a.x * self.b.y - self.a.y * self.b.x)

        presses_a = (self.prize.x - self.b.x * presses_b) / self.a.x
        """
        presses_b = (self.a.x * self.prize.y - self.a.y * self.prize.x) / (self.a.x * self.b.y - self.a.y * self.b.x)
        presses_a = (self.prize.x - self.b.x * presses_b) / self.a.x

        if not presses_a.is_integer() or not presses_b.is_integer():
            return False
        return presses_a * self.COST_A + presses_b * self.COST_B

    def prize_cost(self):
        a = self.a
        b = self.b
        prize = self.prize

        CHEAPEST_PLACEHOLDER = 10000000000
        cheapest = CHEAPEST_PLACEHOLDER
        cost_so_far = 0
        while True:
            if (prize.x < a.x or prize.y < a.y) and \
               (prize.x < b.x or prize.y < b.y):
                break
            
            if prize.x % a.x == prize.y % a.y == 0 and \
            prize.x / a.x == prize.y / a.y:
                cheapest = min(cheapest, cost_so_far + self.COST_A * prize.x / a.x)

            if prize.x % b.x == prize.y % b.y == 0 and \
            prize.x / b.x == prize.y / b.y:
                cheapest = min(cheapest, cost_so_far + self.COST_B * prize.x / b.x)
            
            # Press button A and check again
            prize = Point(prize.x - a.x, prize.y - a.y)
            cost_so_far += self.COST_A

        if cheapest == CHEAPEST_PLACEHOLDER:
            return False
        return cheapest


machines = []
for line in input.splitlines():
    if line.startswith("Button A:"):
        machine = Machine()
        machines.append(machine)
        a_x, a_y = line.split(":")[1].split(",")
        machine.a = Point(int(a_x.split("+")[1]), int(a_y.split("+")[1]))
    elif line.startswith("Button B:"):
        b_x, b_y = line.split(":")[1].split(",")
        machine.b = Point(int(b_x.split("+")[1]), int(b_y.split("+")[1]))
    elif line.startswith("Prize:"):
        prize_x, prize_y = line.split(":")[1].split(",")
        machine.prize = Point(
            int(prize_x.split("=")[1]) + 10000000000000,
            int(prize_y.split("=")[1]) + 10000000000000,
        )

cost_sum = 0
for machine in machines:
    cost = machine.prize_cost_eq()
    if cost:
        cost_sum += cost

print(cost_sum)
