#!/bin/bash

# Ensure log directory exists
LOG_DIR="/home/sahanico/fastr/logs"
mkdir -p $LOG_DIR

# Log file
LOG_FILE="${LOG_DIR}/mongo_backup_and_transfer.log"

# Timestamp
TIMESTAMP=$(date +"%Y-%m-%d")
echo "Starting MongoDB backup at $TIMESTAMP" | tee -a $LOG_FILE

# Dump directory
DUMP_DIR="/home/sahanico/taxdollar_data/db_backup_${TIMESTAMP}"

# MongoDB dump
echo "Creating MongoDB dump..." | tee -a $LOG_FILE
mongodump --authenticationDatabase admin --db taxdollar --uri "mongodb://192.168.12.250:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false" -u sahanico -p 760ashprior -o $DUMP_DIR

# Zip the dump (quietly)
echo "Zipping MongoDB dump..." | tee -a $LOG_FILE
zip -rq "${DUMP_DIR}.zip" $DUMP_DIR

# SCP with password (using sshpass)
echo "Transferring MongoDB dump..." | tee -a $LOG_FILE
sshpass -p '760ashprior' scp "${DUMP_DIR}.zip" sahanico@192.168.12.249:/home/sahanico/taxdollar_data/db_backup

# Clean up
echo "Cleaning up..." | tee -a $LOG_FILE
rm -rf $DUMP_DIR
rm "${DUMP_DIR}.zip"

echo "MongoDB backup and transfer completed at $(date +"%Y-%m-%d %H:%M:%S")" | tee -a $LOG_FILE
