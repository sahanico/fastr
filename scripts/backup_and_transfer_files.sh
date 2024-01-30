#!/bin/bash

# Ensure log directory exists
LOG_DIR="/home/sahanico/fastr/logs"
mkdir -p $LOG_DIR

# Log file
LOG_FILE="${LOG_DIR}/backup_and_transfer.log"

# Timestamp
TIMESTAMP=$(date +"%Y-%m-%d")
echo "Starting backup at $TIMESTAMP" | tee -a $LOG_FILE

# Directories
SOURCE_DIR="/home/sahanico/fastr/apps/api/files"
DEST_DIR="/home/sahanico/fastr/apps/api/files_backup_${TIMESTAMP}"

# Create a copy with a timestamp
echo "Creating backup..." | tee -a $LOG_FILE
cp -r $SOURCE_DIR $DEST_DIR

# Zip the files (quietly)
echo "Zipping backup..." | tee -a $LOG_FILE
zip -rq "${DEST_DIR}.zip" $DEST_DIR

# SCP with password (using sshpass)
echo "Transferring backup..." | tee -a $LOG_FILE
sshpass -p '760ashprior' scp "${DEST_DIR}.zip" sahanico@192.168.12.249:/home/sahanico/taxdollar_data/files_backup

# Delete the copied folder and zip
echo "Cleaning up..." | tee -a $LOG_FILE
rm -rf $DEST_DIR
rm "${DEST_DIR}.zip"

echo "Backup and transfer completed at $(date +"%Y-%m-%d %H:%M:%S")" | tee -a $LOG_FILE
