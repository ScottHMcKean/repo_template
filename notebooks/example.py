# Databricks notebook source
# An entrypoint, not a place for logic. Anything worth testing belongs in src/.

# COMMAND ----------

from project_name import table_name

dbutils.widgets.text("catalog", "")
dbutils.widgets.text("schema", "")

target = table_name(
    dbutils.widgets.get("catalog"),
    dbutils.widgets.get("schema"),
    "example",
)
print(f"would write to {target}")
