import argv
import console
import gleam/bool
import gleam/erlang/process
import gleam/int
import gleam/io
import gleam/list
import gleam/otp/task
import gleam/string

pub type Transaction {
  Expense(
    id: Int,
    name: String,
    amount: Int,
    date: String,
    category: String,
    description: String,
  )
  Income(
    id: Int,
    name: String,
    amount: Int,
    date: String,
    category: String,
    description: String,
  )
}

type TransactionState =
  List(Transaction)

fn print_transactions(transactions: List(Transaction)) {
  io.println("All Transactions:")
  io.println("------------------")

  transactions
  |> list.each(fn(transaction) {
    case transaction {
      Expense(id, name, amount, _date, _category, _description) ->
        io.println(
          "Expense: " <> int.to_string(id) <> name <> int.to_string(amount),
        )
      Income(id, name, amount, _date, _category, _description) ->
        io.println(
          "Income:  " <> int.to_string(id) <> name <> int.to_string(amount),
        )
    }
  })
}

fn clear_screen() {
  // ANSI escape sequence to clear screen and move cursor to home position
  io.print("\u{001b}[H\u{001b}[2J")
}

fn print_usage() {
  io.println("Options:")
  io.println("--------")
  io.println("  [1] Add <text>   - Neue Aufgabe hinzufügen")
  io.println("  [2] List         - Alle Aufgaben anzeigen")
  io.println("  [3] Delete <id>  - Aufgabe löschen")
  io.println("  [4] Done <id>    - Aufgabe als erledigt markieren")
  io.println("  [5] Help         - Hilfe anzeigen")
}

fn read_line() {
  // case argv.load().arguments {
  //   ["hello", name] -> io.println("Hello, " <> name <> "!")
  //   _ -> io.println("usage: ./program hello <name>")
  // }
  let user_input = console.read_input("> ")
  string.replace(user_input, "\n", "")
}

fn add_transaction() {
  clear_screen()
  io.println("Add Transaction")

  let user_input = read_line()

  let amount = int.parse(user_input)
  case amount {
    Ok(amount) -> io.println("Amount: " <> int.to_string(amount))
    Error(Nil) -> io.println("Amount: Invalid")
  }
}

fn delete_transaction(transactions) {
  clear_screen()
  io.println("Delete Transaction")
  let transaction_id = int.parse(read_line())
  case transaction_id {
    Ok(transaction_id) ->
      transactions
      |> list.filter(fn(transaction) {
        case transaction {
          Expense(id, _, _, _, _, _) -> id != transaction_id
          Income(id, _, _, _, _, _) -> id != transaction_id
        }
      })
      |> print_transactions()
    Error(Nil) -> io.println("Transaction ID: Invalid")
  }
}

pub fn main() {
  let transactions = [
    Expense(1, "1", 1, "1.1", "1", "1"),
    Income(2, "1", 1, "1.1", "1", "1"),
  ]
  // print_transactions([Expense(1, "1", 1, "1.1", "1", "1"), Income(1, "1", 1, "1.1", "1", "1")])
  print_usage()
  let user_input = read_line()

  // read_line()
  case user_input {
    "1" -> add_transaction()
    "2" -> print_transactions(transactions)
    "3" -> delete_transaction(transactions)
    // "4" -> 
    "5" -> print_usage()
    _ -> print_usage()
  }
  io.println("You entered: " <> "\"" <> user_input <> "\"")

  main()
}
